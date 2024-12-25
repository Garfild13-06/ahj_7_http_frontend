(()=>{var t={930:()=>{const t="http://localhost:7070";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".ticket-list"),n=document.getElementById("add-ticket-btn"),i=document.getElementById("ticket-modal"),a=document.getElementById("modal-title"),s=document.getElementById("ticket-form"),c=document.getElementById("ticket-title"),d=document.getElementById("ticket-description"),o=document.querySelector(".cancel-btn"),l=document.getElementById("delete-modal"),r=l.querySelector(".cancel"),u=l.querySelector(".delete");let v=null,p=null;function m(t){const n=document.createElement("li");n.className="ticket "+(t.status?"completed":""),n.dataset.id=t.id,n.innerHTML=`\n      <div class="title-row">\n        <div class="left-section">\n          <input type="checkbox" ${t.status?"checked":""} data-id="${t.id}" class="toggle-status">\n          <span class="title" data-id="${t.id}">${t.title}</span>\n        </div>\n        <div class="right-section">\n          <span>${new Date(t.createdAt).toLocaleString()}</span>\n          <div class="actions">\n            <button data-id="${t.id}" class="edit-btn">✏️</button>\n            <button data-id="${t.id}" class="delete-btn">❌</button>\n          </div>\n        </div>\n      </div>\n      <div class="description"></div>\n    `,e.appendChild(n)}async function y(e){const n=await fetch(`${t}/?method=ticketById&id=${e}`);return await n.json()}async function g(t){const e=await y(t),n=document.querySelector(`.ticket[data-id="${t}"]`);if(n){const i=n.classList.contains("open");n.className="ticket "+(e.status?"completed":""),n.innerHTML=`\n        <div class="title-row">\n          <div class="left-section">\n            <input type="checkbox" ${e.status?"checked":""} data-id="${t}" class="toggle-status">\n            <span class="title" data-id="${t}">${e.title}</span>\n          </div>\n          <div class="right-section">\n            <span>${new Date(e.createdAt).toLocaleString()}</span>\n            <div class="actions">\n              <button data-id="${t}" class="edit-btn">✏️</button>\n              <button data-id="${t}" class="delete-btn">❌</button>\n            </div>\n          </div>\n        </div>\n        <div class="description">${i?e.description||"Нет описания.":""}</div>\n      `,i&&n.classList.add("open")}}function f(){let t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};a.textContent=t?"Изменить тикет":"Добавить тикет",c.value=t?e.title:"",d.value=t?e.description:"",v=t?e.id:null,i.classList.add("active")}function h(){i.classList.remove("active")}function k(){p=null,l.classList.remove("active")}e.addEventListener("click",(async e=>{const{id:n}=e.target.dataset,i=e.target.closest(".ticket");e.target.classList.contains("toggle-status")?async function(e,n){try{const i=n;await fetch(`${t}/?method=editTicketStatus`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e,status:i})}),g(e)}catch(t){console.error("Failed to toggle ticket status:",t)}}(n,e.target.checked):e.target.classList.contains("edit-btn")?f(!0,await y(n)):e.target.classList.contains("delete-btn")?function(t){p=t,l.classList.add("active")}(n):e.target.classList.contains("title")&&i&&async function(t,e){const n=t.querySelector(".description");if(!t.classList.contains("open")){const t=await y(e);n.innerText=t.description||"Нет описания."}t.classList.toggle("open")}(i,n)})),n.addEventListener("click",(()=>{f(!1)})),s.addEventListener("submit",(async function(e){e.preventDefault();const n=c.value,i=d.value,a=v?"editTicket":"createTicket",s=v?"PUT":"POST",o=await fetch(`${t}/?method=${a}`,{method:s,headers:{"Content-Type":"application/json"},body:JSON.stringify({id:v,name:n,description:i,status:!1})}),l=await o.json();h(),v?g(v):m(l)})),o.addEventListener("click",h),r.addEventListener("click",k),u.addEventListener("click",(async function(){p&&((await fetch(`${t}/?method=deleteTicket&id=${p}`,{method:"DELETE"})).ok&&function(t){const e=document.querySelector(`.ticket[data-id="${t}"]`);e&&e.remove()}(p),k())})),async function(){const n=await fetch(`${t}/?method=allTickets`),i=await n.json();e.innerHTML="",i.forEach((t=>m(t)))}()}))}},e={};function n(i){var a=e[i];if(void 0!==a)return a.exports;var s=e[i]={exports:{}};return t[i](s,s.exports,n),s.exports}n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";n(930)})()})();
//# sourceMappingURL=main.js.map