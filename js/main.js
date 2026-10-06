(function(){'use strict';
var h=document.getElementById('site-header'),b=document.body,t=document.getElementById('menu-toggle'),c=document.getElementById('menu-close');
function shut(){b.classList.remove('mobile-menu-open');if(t)t.setAttribute('aria-expanded','false')}
if(h)addEventListener('scroll',function(){h.classList.toggle('is-scrolled',scrollY>50)},{passive:true});
if(t)t.addEventListener('click',function(){t.setAttribute('aria-expanded',b.classList.toggle('mobile-menu-open'))});
if(c)c.addEventListener('click',shut);
document.querySelectorAll('.mobile-nav-link').forEach(function(a){a.addEventListener('click',shut)});
var agendaSection=document.getElementById('agenda');
if(agendaSection){
var navLinks=document.querySelectorAll('.nav-list .nav-item-link,.mobile-nav-list .mobile-nav-link');
function syncAgendaNav(){
var agendaIsActive=location.hash==='#agenda';
navLinks.forEach(function(a){
var href=a.getAttribute('href');
var isAgendaLink=href==='#agenda'||href==='index.html#agenda';
var isHomeLink=href==='index.html';
var isActive=agendaIsActive?isAgendaLink:isHomeLink;
a.classList.toggle('is-active',isActive);
if(isActive)a.setAttribute('aria-current','page');
else a.removeAttribute('aria-current');
});
}
syncAgendaNav();
addEventListener('hashchange',syncAgendaNav);
}
addEventListener('keydown',function(e){if(e.key==='Escape')shut()});
})();
