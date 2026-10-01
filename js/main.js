(function(){'use strict';
var h=document.getElementById('site-header'),b=document.body,t=document.getElementById('menu-toggle'),c=document.getElementById('menu-close');
function shut(){b.classList.remove('mobile-menu-open');if(t)t.setAttribute('aria-expanded','false')}
if(h)addEventListener('scroll',function(){h.classList.toggle('is-scrolled',scrollY>50)},{passive:true});
if(t)t.addEventListener('click',function(){t.setAttribute('aria-expanded',b.classList.toggle('mobile-menu-open'))});
if(c)c.addEventListener('click',shut);
document.querySelectorAll('.mobile-nav-link').forEach(function(a){a.addEventListener('click',shut)});
addEventListener('keydown',function(e){if(e.key==='Escape')shut()});
})();
