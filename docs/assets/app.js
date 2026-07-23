/* Plunk Cup 2025 — interactivity (vanilla) */
(function(){
  'use strict';
  document.documentElement.classList.add('js');

  // mobile nav
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.mainnav');
  var scrim = document.querySelector('.navscrim');
  function closeNav(){ nav.classList.remove('open'); burger.classList.remove('x'); burger.setAttribute('aria-expanded','false'); scrim.classList.remove('show'); }
  if (burger){
    burger.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      burger.classList.toggle('x', open);
      burger.setAttribute('aria-expanded', open?'true':'false');
      scrim.classList.toggle('show', open);
    });
    scrim.addEventListener('click', closeNav);
    nav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });
  }

  // tabs
  document.querySelectorAll('.tabs').forEach(function(group){
    var tabs = group.querySelectorAll('.tab');
    tabs.forEach(function(t){
      t.addEventListener('click', function(){
        tabs.forEach(function(x){ x.classList.remove('on'); });
        t.classList.add('on');
        var id = 'tab-' + t.getAttribute('data-tab');
        document.querySelectorAll('.tabpane').forEach(function(p){ p.classList.toggle('on', p.id===id); });
      });
    });
  });

  // draft board filter
  var board = document.querySelector('.board');
  document.querySelectorAll('.fbtn').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('.fbtn').forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      var f = b.getAttribute('data-f');
      if (!board) return;
      board.querySelectorAll('[data-team]').forEach(function(el){ el.classList.remove('hi'); });
      if (f === 'all'){ board.classList.remove('dim-others'); return; }
      board.classList.add('dim-others');
      board.querySelectorAll('[data-team="'+f+'"]').forEach(function(el){ el.classList.add('hi'); });
    });
  });

  // scroll reveal
  var io;
  if ('IntersectionObserver' in window){
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:.12 });
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }
})();
