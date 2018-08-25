'use strict';
(()=>{
  setTimeout(()=> {
    debugger;
    var my_awesome_script = document.createElement('script');
    my_awesome_script.setAttribute('src','/script/dynamic.script.js');
    document.head.appendChild(my_awesome_script);
  }, 1500);
})();
