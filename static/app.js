function getSelections() {
    const zhuo = document.querySelector('input[name="zhuo"]:checked').value;
    const ying = document.querySelector('input[name="ying"]:checked').value;
    return { zhuo, ying };
}

function updateTotalPreview() {
    const { zhuo, ying } = getSelections();
    const zhuoCredits = zhuo === "高翻班" ? 101 : 95;
    const yingCredits = (ying === "翻译+工管" || ying === "英语+国政") ? 93 : 69;
    const total = zhuoCredits + yingCredits;
    document.getElementById("total-preview").textContent =
        `${zhuo} (${zhuoCredits}) + ${ying} (${yingCredits}) = ${total} 学分`;
}

// Attach change listeners
document.querySelectorAll('input[name="zhuo"], input[name="ying"]').forEach(el => {
    el.addEventListener("change", updateTotalPreview);
});

function toggleScores() {
    document.body.classList.toggle("hide-scores", document.getElementById("hide-scores").checked);
}

async function checkCredits() {
    const text = document.getElementById("transcript").value.trim();
    if (!text) return;

    const { zhuo, ying } = getSelections();
    const btn = document.getElementById("check-btn");
    btn.textContent = "检查中...";
    btn.disabled = true;

    try {
        const res = await fetch("/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcript: text, zhuo_class: zhuo, ying_class: ying }),
        });
        const data = await res.json();
        renderResults(data);
    } catch (e) {
        alert("Error: " + e.message);
    } finally {
        btn.textContent = "检查学分";
        btn.disabled = false;
    }
}

function renderResults(data) {
    document.getElementById("results-section").style.display = "block";

    const totalEl = document.getElementById("summary-total");
    const statusEl = document.getElementById("summary-status");
    const cls = data.total_complete ? "complete" : "incomplete";

    totalEl.innerHTML = `
        <div class="label">已修 / 总计</div>
        <div class="value ${cls}">${data.total_earned} / ${data.total_target}</div>
    `;
    statusEl.innerHTML = `
        <div class="label">状态</div>
        <div class="value ${cls}">${data.total_complete ? "已完成全部学分" : "未完成 (差 " + (data.total_target - data.total_earned) + " 学分)"}</div>
    `;

    // Missing summary
    const missingEl = document.getElementById("missing-summary");
    if (data.missing && data.missing.length > 0) {
        document.getElementById("missing-section").style.display = "block";
        missingEl.innerHTML = "";
        for (const m of data.missing) {
            const div = document.createElement("div");
            div.className = "missing-item";
            div.innerHTML = `
                <span class="missing-dot"></span>
                <span class="missing-course">${m.course}</span>
                <span class="missing-cat">${m.category}</span>
                <span class="missing-credits">${m.credits}学分</span>
            `;
            missingEl.appendChild(div);
        }
    } else {
        document.getElementById("missing-section").style.display = "none";
    }

    // Overflow (excess credits)
    const overflowEl = document.getElementById("overflow-summary");
    if (data.overflow && data.overflow.length > 0) {
        document.getElementById("overflow-section").style.display = "block";
        overflowEl.innerHTML = "";
        for (const o of data.overflow) {
            const div = document.createElement("div");
            div.className = "overflow-item";
            div.innerHTML = `
                <span class="overflow-dot"></span>
                <span class="overflow-cat">${o.category}</span>
                <span class="overflow-detail">${o.earned} / ${o.target}</span>
                <span class="overflow-excess">+${o.excess}学分</span>
            `;
            overflowEl.appendChild(div);
        }
    } else {
        document.getElementById("overflow-section").style.display = "none";
    }

    // Sections
    const container = document.getElementById("results");
    container.innerHTML = "";

    for (const section of data.results) {
        const sDiv = document.createElement("div");
        sDiv.className = "section";

        const sCls = section.section_earned >= section.section_target ? "complete" : "incomplete";
        sDiv.innerHTML = `
            <div class="section-header">
                <h2>${section.name}</h2>
                <span class="credits-badge" style="color: ${sCls === 'complete' ? '#34c759' : '#ff3b30'}">${section.section_earned} / ${section.section_target}</span>
            </div>
        `;

        for (const cat of section.categories) {
            sDiv.appendChild(renderCategory(cat));
        }

        container.appendChild(sDiv);
    }

    // Uncategorized
    if (data.uncategorized && data.uncategorized.length > 0) {
        document.getElementById("uncategorized-section").style.display = "block";
        const ucDiv = document.getElementById("uncategorized");
        ucDiv.innerHTML = "";
        for (const c of data.uncategorized) {
            ucDiv.innerHTML += `<div class="course-item">
                <span><span class="name">${c.name}</span><span class="code">${c.code}</span></span>
                <span class="meta"><span class="credits">${c.credits}学分</span><span class="score">${c.score}</span></span>
            </div>`;
        }
    } else {
        document.getElementById("uncategorized-section").style.display = "none";
    }

    document.getElementById("missing-section").scrollIntoView({ behavior: "smooth" });
}

function renderCategory(cat) {
    const div = document.createElement("div");
    div.className = "category";

    const pct = cat.target > 0 ? Math.min(100, Math.round((cat.earned / cat.target) * 100)) : 100;
    const status = cat.complete ? "done" : (cat.earned > 0 ? "partial" : "missing");
    const displayEarned = cat.earned !== undefined ? cat.earned : cat.capped;

    div.innerHTML = `
        <div class="category-header" onclick="this.parentElement.classList.toggle('open')">
            <div class="left">
                <span class="status-dot ${status}"></span>
                <span class="cat-name">${cat.name}</span>
            </div>
            <div class="right">
                <span class="progress-text">${displayEarned} / ${cat.target}</span>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill ${status}" style="width: ${pct}%"></div>
                </div>
                <span class="chevron">&#9654;</span>
            </div>
        </div>
    `;

    const body = document.createElement("div");
    body.className = "category-body";

    if (cat.subcategories) {
        for (const sub of cat.subcategories) {
            body.appendChild(renderSubcategory(sub));
        }
    } else {
        if (cat.required_courses) {
            for (const rc of cat.required_courses) {
                body.appendChild(renderReqCourse(rc));
            }
        }
        if (cat.courses) {
            for (const c of cat.courses) {
                body.appendChild(renderCourseItem(c));
            }
        }
        if (cat.note) {
            const note = document.createElement("div");
            note.className = "note";
            note.textContent = cat.note;
            body.appendChild(note);
        }
    }

    div.appendChild(body);
    return div;
}

function renderSubcategory(sub) {
    const div = document.createElement("div");
    div.className = "subcategory";

    const status = sub.complete ? "done" : (sub.earned > 0 ? "partial" : "missing");

    div.innerHTML = `
        <div class="subcat-header">
            <span class="name"><span class="status-dot ${status}" style="display:inline-block;margin-right:6px;"></span>${sub.name}</span>
            <span class="credits">${sub.earned} / ${sub.target}</span>
        </div>
    `;

    if (sub.required_courses) {
        for (const rc of sub.required_courses) {
            div.appendChild(renderReqCourse(rc));
        }
    }

    if (sub.courses) {
        for (const c of sub.courses) {
            div.appendChild(renderCourseItem(c));
        }
    }

    if (sub.note) {
        const note = document.createElement("div");
        note.className = "note";
        note.textContent = sub.note;
        div.appendChild(note);
    }

    return div;
}

function renderReqCourse(rc) {
    const div = document.createElement("div");
    div.className = "req-course" + (rc.done ? "" : " is-missing");
    div.innerHTML = `
        <span class="check ${rc.done ? 'done' : 'missing'}">${rc.done ? '✓' : ''}</span>
        <span class="name">${rc.name}</span>
        <span class="credits" style="color:#86868b;margin-left:auto;">${rc.credits}学分</span>
    `;
    return div;
}

function renderCourseItem(c) {
    const div = document.createElement("div");
    div.className = "course-item";
    div.innerHTML = `
        <span><span class="name">${c.name}</span><span class="code">${c.code}</span></span>
        <span class="meta"><span class="credits">${c.credits}学分</span><span class="score">${c.score}</span></span>
    `;
    return div;
}
