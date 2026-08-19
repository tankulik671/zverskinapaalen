'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  uploadAvatar: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId, sessionUser = null) => {
    if (!userId) {
      setProfile(null);
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Profile fetch warning:', error.message);
        return null;
      }

      // If user profile does not exist in 'users' table (e.g. first login via Google OAuth)
      if (!data && sessionUser) {
        const defaultNick = (
          sessionUser.user_metadata?.full_name ||
          sessionUser.user_metadata?.name ||
          sessionUser.email?.split('@')[0] ||
          'user'
        ).slice(0, 20);

        const defaultPhoto =
          sessionUser.user_metadata?.avatar_url ||
          sessionUser.user_metadata?.picture ||
          '/images/avatarka01.jpg';

        const { data: newProf, error: insertError } = await supabase
          .from('users')
          .upsert({
            id: userId,
            nickname: defaultNick,
            email: sessionUser.email || '',
            photo: defaultPhoto,
            about: 'Расскажи о себе',
          })
          .select()
          .maybeSingle();

        if (!insertError && newProf) {
          setProfile(newProf);
          return newProf;
        }
      }

      setProfile(data || null);
      return data;
    } catch (err) {
      console.warn('Error loading profile:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.warn('Auth init warning:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Неверный логин или пароль');

    setUser(data.user);
    const prof = await fetchProfile(data.user.id);
    return prof || { id: data.user.id, email: data.user.email };
  };

  const register = async (nickname, email, password) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nickname: nickname || '',
        },
      },
    });
    if (authError) throw authError;
    if (!authData.user) throw new Error('Не удалось создать пользователя');

    const userId = authData.user.id;

    // Create or update profile row in users table
    const { data: profData, error: profError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        nickname: nickname || '',
        email: email,
        photo: '/images/avatarka01.jpg',
        about: 'Расскажи о себе',
      })
      .select()
      .maybeSingle();

    if (profError) {
      console.warn('Profile create note:', profError.message);
    }

    setUser(authData.user);
    const currentProf = profData || { id: userId, nickname, email, photo: '/images/avatarka01.jpg', about: 'Расскажи о себе' };
    setProfile(currentProf);
    return currentProf;
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('Пользователь не авторизован');
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .maybeSingle();

    if (error) throw error;
    const updated = data || { ...profile, ...updates };
    setProfile(updated);
    return updated;
  };

  const uploadAvatar = async (file) => {
    if (!user) throw new Error('Пользователь не авторизован');
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `user_${user.id}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    await updateProfile({ photo: publicUrl });
    return publicUrl;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        uploadAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
