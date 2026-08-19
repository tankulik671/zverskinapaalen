'use client';

import Header from '@/components/Header';

export default function MainPage() {
  return (
    <div style={{ textAlign: 'center', minHeight: '100vh', paddingBottom: 60 }}>
      <div style={{ animation: 'fadeInUp 6s ease forwards', animationDelay: '1s', opacity: 0 }}>
        <Header />
      </div>

      <main
        style={{
          animation: 'fadeInUp 6s ease forwards',
          animationDelay: '2s',
          opacity: 0,
          maxWidth: 900,
          margin: '0 auto',
          padding: '0 20px'
        }}
      >
        <h1
          style={{
            fontSize: '2.8em',
            color: '#00b7ff',
            marginTop: 40,
            fontStyle: 'italic',
            textShadow: '0 0 8px #0077ff'
          }}
        >
          ВСЕМ ПРИВЕТ!
        </h1>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 15 }}>ЭТО МОЙ РЕП САЙТ :)</p>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 10 }}>
          ЕСЛИ ВЫ ПОПАЛИ СЮДА, ЗНАЧИТ БЫЛО ОПУБЛИКОВАНО МОЕ НОВОЕ РЕП ЕКСТЕНДЕД ПЛЕЙ ПОД НАЗВАНИЕМ МЦ УБОЙНЫЙ СТАФФЧИК.
        </p>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 10 }}>
          Я ЖЕЛАЮ ВАМ ПРИЯТНОГО ПРОСЛУШИВАНИЯ И ИССЛЕДОВАНИЯ САЙТА. КРЕПИТЕСЬ. НАДЕЮСЬ У ВАС ХОТЬ РУБЛЬ В КАРМАНЕ ПОЯВИТСЯ!
        </p>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 10 }}>
          ТЕКСТ К КАЖДОМУ ТРЕКУ ВЫ МОЖЕТЕ НАЙТИ В РАЗДЕЛЕ &quot;ДИСКОГРАФИЯ&quot; :33
        </p>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 10 }}>
          НАСТОЯТЕЛЬНО РЕКОМЕНДУЮ ЗАХОДИТЬ С ПЕРСОНАЛЬНОГО КОМПЬЮТЕРА ИЛИ ВКЛЮЧАТЬ ПК ВЕРСИЮ,
        </p>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 10 }}>
          ПОТОМУ ЧТО НА МОБИЛОДРОЧЕРОВ Я ССАЛ С МОСКОВСКОЙ ЭЛИТНОЙ ВЫСОТКИ И АДАПТИВНОСТЬ НЕ ПРИКРУТИЛ!
        </p>

        <h2
          style={{
            fontSize: '1.4em',
            color: '#00bfff',
            marginTop: 50,
            textShadow: '0 0 5px rgba(0, 191, 255, 0.4)'
          }}
        >
          ВОТ МОИ СТРАНИЧКИ В СОЦСЕТЯХ
        </h2>

        <div
          className="links-block"
          style={{
            display: 'inline-block',
            background: 'rgba(0, 10, 25, 0.35)',
            border: '1px solid rgba(0, 150, 255, 0.4)',
            borderRadius: 12,
            padding: '25px 50px',
            marginTop: 25,
            boxShadow: '0 0 25px rgba(0, 100, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            transition: 'box-shadow 0.4s ease, transform 0.4s ease',
            animation: 'fadeInUp 6s ease forwards',
            animationDelay: '3.5s',
            opacity: 0
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ margin: '15px 0' }}>
              <a
                href="https://soundcloud.com/zverskinapalen"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ccff', fontSize: '1.2em' }}
              >
                МОЙ САУНДУКЛАНДУС (ТАМ НОВЫЕ РЕЛИЗЫ В ФОРМАТЕ WAW)
              </a>
            </li>
            <li style={{ margin: '15px 0' }}>
              <a
                href="https://t.me/zverskinapalen"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ccff', fontSize: '1.2em' }}
              >
                МОЙ ТЕЛЕГРАМ-КАНАЛ
              </a>
            </li>
            <li style={{ margin: '15px 0' }}>
              <a
                href="https://zverskinapalen.neocities.org/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#00ccff', fontSize: '1.2em' }}
              >
                МОЙ САЙТ
              </a>
            </li>
          </ul>
        </div>
      </main>

      <footer
        style={{
          marginTop: 50,
          animation: 'fadeInUp 6s ease forwards',
          animationDelay: '4.5s',
          opacity: 0
        }}
      >
        <p style={{ fontSize: '1.1em', color: '#d0d0d0' }}>
          Я НАМЕРЕН МОДЕРНИЗИРОВАТЬ ЭТОТ САЙТ В ДАЛЬНЕЙШЕМ. СПАСИБО ЗА ВНИМАНИЕ!
        </p>
        <p style={{ fontSize: '1.1em', color: '#d0d0d0', marginTop: 10 }}>
          ПОТЫКАЙТЕ НА ФОН, СПАВНЯТСЯ СОБАЧКИ. УГАР ПОЛНЕЙШИЙ НАМУТИЛ)))
        </p>
      </footer>
    </div>
  );
}
