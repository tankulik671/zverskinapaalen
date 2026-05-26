import { useEffect } from "react";

export default function MainPage() {
  useEffect(() => {
    const maxLogos = 15;
    const flyingLogos = [];

    function createFrontLogo() {
      const logo = document.createElement("div");
      logo.className = "floating-logo";
      const size = Math.random() * 400 + 200;
      const duration = Math.random() * 20 + 15;
      const startX = `${Math.random() * 100}vw`;
      const startY = `${Math.random() * 100}vh`;
      const endX = `${Math.random() * 100}vw`;
      const endY = `${Math.random() * 100}vh`;

      Object.assign(logo.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: "url(/images/logo.png)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        pointerEvents: "none",
        zIndex: 10000,
        filter: "blur(2px)",
        opacity: 1,
        willChange: "transform",
        animation: `floatLogo ${duration}s ease-in-out forwards`,
      });

      logo.style.setProperty("--start-x", startX);
      logo.style.setProperty("--start-y", startY);
      logo.style.setProperty("--end-x", endX);
      logo.style.setProperty("--end-y", endY);
      logo.style.setProperty("--scale", Math.random() * 0.8 + 0.8);
      logo.style.setProperty("--rotate", `${Math.random() * 720 - 360}deg`);
      logo.style.setProperty("--opacity", 1);

      document.body.appendChild(logo);
      setTimeout(() => logo.remove(), duration * 1000);
    }

    const frontInterval = setInterval(
      createFrontLogo,
      60000 + Math.random() * 15000
    );

    function createFlyingLogo(x, y) {
      if (flyingLogos.length >= maxLogos) {
        const oldest = flyingLogos.shift();
        oldest.remove();
      }

      const logo = document.createElement("div");
      logo.className = "floating-logo";
      const size = Math.random() * 200 + 50;
      const duration = Math.random() * 25 + 10;
      const blur = Math.random() * 6;
      const opacity = Math.random() * 0.4 + 0.1;

      const startX = x ? `${x}px` : `${Math.random() * 120 - 10}vw`;
      const startY = y ? `${y}px` : `${Math.random() * 120 - 10}vh`;
      const endX = `${Math.random() * 120 - 10}vw`;
      const endY = `${Math.random() * 120 - 10}vh`;

      Object.assign(logo.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: "url(/images/logo.png)",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        pointerEvents: "none",
        zIndex: 0,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: "transform",
        animation: `floatLogo ${duration}s linear forwards`,
      });

      logo.style.setProperty("--start-x", startX);
      logo.style.setProperty("--start-y", startY);
      logo.style.setProperty("--end-x", endX);
      logo.style.setProperty("--end-y", endY);
      logo.style.setProperty("--scale", Math.random() * 1.5 + 0.5);
      logo.style.setProperty("--rotate", `${Math.random() * 1080 - 540}deg`);
      logo.style.setProperty("--opacity", opacity);

      document.body.appendChild(logo);
      flyingLogos.push(logo);

      logo.addEventListener("animationend", () => {
        logo.remove();
        const idx = flyingLogos.indexOf(logo);
        if (idx !== -1) flyingLogos.splice(idx, 1);
      });
    }

    const interval = setInterval(() => createFlyingLogo(), 1200);

    const handleClick = (e) => {
      if (!e.target.closest("a, iframe, .links-block, header, nav"))
        createFlyingLogo(e.clientX, e.clientY);
    };
    document.body.addEventListener("click", handleClick);

    return () => {
      clearInterval(interval);
      clearInterval(frontInterval);
      document.body.removeEventListener("click", handleClick);
      document.querySelectorAll(".floating-logo").forEach((el) => el.remove());
    };
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "2.8em", color: "#00b7ff", marginTop: 40, fontStyle: "italic", textShadow: "0 0 8px #0077ff" }}>
        ВСЕМ ПРИВЕТ!
      </h1>

      <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 20 }}>
        ЭТО МОЙ РЕП САЙТ :)
      </p>
      <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 10 }}>
        ЕСЛИ ВЫ ПОПАЛИ СЮДА, ЗНАЧИТ БЫЛО ОПУБЛИКОВАНО МОЕ НОВОЕ РЕП ЕКСТЕНДЕД
        ПЛЕЙ ПОД НАЗВАНИЕМ МЦ УБОЙНЫЙ СТАФФЧИК.
      </p>
      <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 10 }}>
        Я ЖЕЛАЮ ВАМ ПРИЯТНОГО ПРОСЛУШИВАНИЯ И ИССЛЕДОВАНИЯ САЙТА. КРЕПИТЕСЬ.
        НАДЕЮСЬ У ВАС ХОТЬ РУБЛЬ В КАРМАНЕ ПОЯВИТСЯ!
      </p>
      <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 10 }}>
        ТЕКСТ К КАЖДОМУ ТРЕКУ ВЫ МОЖЕТЕ НАЙТИ В РАЗДЕЛЕ &quot;ДИСКОГРАФИЯ&quot; :33
      </p>
      <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 10 }}>
        НАСТОЯТЕЛЬНО РЕКОМЕНДУЮ ЗАХОДИТЬ С ПЕРСОНАЛЬНОГО КОМПЬЮТЕРА ИЛИ
        ВКЛЮЧАТЬ ПК ВЕРСИЮ,
      </p>
      <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 10 }}>
        ПОТОМУ ЧТО НА МОБИЛОДРОЧЕРОВ Я ССАЛ С МОСКОВСКОЙ ЭЛИТНОЙ ВЫСОТКИ И
        АДАПТИВНОСТЬ НЕ ПРИКРУТИЛ!
      </p>

      <h2 style={{ fontSize: "1.4em", color: "#00bfff", marginTop: 50, textShadow: "0 0 5px rgba(0, 191, 255, 0.4)" }}>
        ВОТ МОИ СТРАНИЧКИ В СОЦСЕТЯХ
      </h2>

      <div
        className="links-block"
        style={{
          display: "inline-block",
          background: "rgba(0, 10, 25, 0.35)",
          border: "1px solid rgba(0, 150, 255, 0.4)",
          borderRadius: 12,
          padding: "25px 50px",
          marginTop: 25,
          boxShadow: "0 0 25px rgba(0, 100, 255, 0.25)",
          backdropFilter: "blur(8px)",
          transition: "box-shadow 0.4s ease, transform 0.4s ease",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li style={{ margin: "15px 0" }}>
            <a
              href="https://soundcloud.com/zverskinapalen"
              target="_blank"
              style={{ color: "#00ccff", fontSize: "1.2em" }}
            >
              МОЙ САУНДУКЛАНДУС (ТАМ НОВЫЕ РЕЛИЗЫ В ФОРМАТЕ WAW)
            </a>
          </li>
          <li style={{ margin: "15px 0" }}>
            <a
              href="https://t.me/zverskinapalen"
              target="_blank"
              style={{ color: "#00ccff", fontSize: "1.2em" }}
            >
              МОЙ ТЕЛЕГРАМ-КАНАЛ
            </a>
          </li>
          <li style={{ margin: "15px 0" }}>
            <a
              href="https://zverskinapalen.neocities.org/"
              target="_blank"
              style={{ color: "#00ccff", fontSize: "1.2em" }}
            >
              МОЙ САЙТ
            </a>
          </li>
        </ul>
      </div>

      <footer style={{ marginTop: 40, paddingBottom: 40 }}>
        <p style={{ fontSize: "1.1em", color: "#d0d0d0" }}>
          Я НАМЕРЕН МОДЕРНИЗИРОВАТЬ ЭТОТ САЙТ В ДАЛЬНЕЙШЕМ. СПАСИБО ЗА
          ВНИМАНИЕ!
        </p>
        <p style={{ fontSize: "1.1em", color: "#d0d0d0", marginTop: 10 }}>
          ПОТЫКАЙТЕ НА ФОН, СПАВНЯТСЯ СОБАЧКИ. УГАР ПОЛНЕЙШИЙ НАМУТИЛ)))
        </p>
      </footer>
    </div>
  );
}
