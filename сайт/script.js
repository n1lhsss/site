
(function initTheme(){
    const saved = localStorage.getItem("theme");
    if(saved === "light") document.body.classList.add("light");

    const btn = document.getElementById("themeBtn");
    if(btn){
        btn.addEventListener("click", () => {
            document.body.classList.toggle("light");
            localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");   
        });
    }
})();

(function hello(){
    const btn = document.getElementById("helloBtn");
    if(!btn) return;

    btn.addEventListener("click", () => {
        const name = localStorage.getItem("studentName") || prompt("Как тебя зовут?");
        if(name && name.trim().length > 0){
            localStorage.setItem("studentName", name.trim());
            alert(`Привет, ${name}! Добро пожаловать в нашу парикмахерскую `)
        }
    });
})(); 

(function likes(){
    const likeBtn = document.getElementById("likeBtn");
    const resetBtn = document.getElementById("likeResetBtn");
    const countEl = document.getElementById("likeCount");

    if(!countEl) return;
    function getCount(){
        return Number(localStorage.getItem("likes" || "0"));
    }
    function render(){
        countEl.textContent = String(getCount());
    }

    render();

    if(likeBtn){
        likeBtn.addEventListener("click", () => {
            const next = getCount() + 1;
            localStorage.setItem("likes", String(next));
            render();
        });
    }

    if(resetBtn){
        resetBtn.addEventListener("click", () => {
            localStorage.setItem("likes", "0");
            render();
        });
    }
})();

(function gallery(){
    const gallery = document.getElementById("gallery");
    const filterBtns = document.querySelectorAll(".filterBtn");
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    const modalClose = document.getElementById("modalClose");
    const modalBackdrop = document.getElementById("modalBackdrop");

    if(gallery && filterBtns.length){
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const f = btn.dataset.filter;
                const items = gallery.querySelectorAll(".gallery__item");
                items.forEach(it => {
                    const cat = it.dataset.cat;
                    const show = (f === "all") || (cat === f);
                    it.style.display = show ? "" : "none";
                });
            });
        });
    }

    if(gallery && modal && modalImg){
        gallery.addEventListener("click", (e) => {
            const img = e.target.closest("img");
            if(!img) return;
            modalImg.src = img.src;
            modal.setAttribute("aria-hidden", "false");
        });
    }

    function close(){
        if(!modal) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
    }

    if(modalClose) modalClose.addEventListener("click", close);
    if(modalBackdrop) modalBackdrop.addEventListener("click", close);
    document.addEventListener("keydown", (e) => {
        if(e.key === "Escape") close();
    });
})();

(function contants(){
    const form = document.getElementById("contactForm");
    const msgsEl = document.getElementById("msgs");
    const clearBtn = document.getElementById("clearMsgsBtn");

    if(!msgsEl) return;

    function load(){
        try{
            return JSON.parse(localStorage.getItem("messages") || "[]");
        }catch{
            return [];
        }
    }

    function save(list){
        localStorage.setItem("messages", JSON.stringify(list));
    }

    function render(){
        const list = load();
        if(list.length === 0){
            msgsEl.textContent = "Пока пусто.";
            return;
        }
        msgsEl.innerHTML = "";
        list.slice().reverse().forEach(m => {
            const div = document.createElement("div");
            div.className = "msg";
            div.innerHTML = `
              <div><strong>${escapeHtml(m.name)}</strong> - <span class="muted">${escapeHtml(m.topic)}
              </span></div>
              <div>${escapeHtml(m.message)}</div>
              <div class="muted" style="margin-top:6px;font-size:12px;">${escapeHtml(m.time)}</div>
            `;
            msgsEl.appendChild(div);
        });
    }

    function escapeHtml(s){
        return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&quot;");
    }

    render();

    if(form){
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const name = String(fd.get("name") || "").trim();
            const topic = String(fd.get("topic") || "").trim();
            const message = String(fd.get("message") || "").trim();

            if(message.length < 5){
                alert("Сообщение слишком короткое (минимум 5 символов).");
                return;
            }

            const list = load();
            list.push({
                name, topic, message,
                time: new DataTransfer().toLocaleString("ru-RU")
            });
            save(list);
            form.reset();
            render();
            alert("Сохранено (в LocalStorage).");
        });
    }

    if(clearBtn){
        clearBtn.addEventListener("click", () => {
            localStorage.removeItem("messages");
            render();
        });
    }
})();

