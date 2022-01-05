function setHref(href) {
  window.location.href = href;
}
function getHref() {
  return window.location.href;
}
function winOpen(href) {
  window.open(href);
}
function parseParams(query) {
  var re = /([^&=]+)=?([^&]*)/g,
    decodeRE = /\+/g,
    decode = function decode(str) {
      return decodeURIComponent(str.replace(decodeRE, " "));
    };
  let params = {},
    e;
  while ((e = re.exec(query))) params[decode(e[1])] = decode(e[2]);
  return params;
}

function sendNotification(title,options){
  if (window.Notification) {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) { // Chrome
        Notification.requestPermission().then(function (permission) {
          if (permission == "granted") {
            // var notification = new Notification("桌面推送", {
            //   body: "这是我的第一条桌面推送",
            //   icon: "some/icon/url",
            // });
            var notification = new Notification(title, options);
            notification.onclick = function () {
              notification.close();
            };
          } else {
            Notification.requestPermission();
            // console.log("没有权限,用户拒绝:Notification");
          }
        });
      } else { // Safari
        Notification.requestPermission(function (permission) {
          if (permission == "granted") {
            var notification = new Notification(title, options);
            notification.onclick = function () {
              notification.close();
            };
          } else {
            Notification.requestPermission();
            // console.log("没有权限,用户拒绝:Notification");
          }
        });
      }
    }
  } else {
    // console.log('不支持Notification');
  }
}

// 
const ID = window.chrome.runtime.id
window[ID] = {
  sendNotification
}

function jump(target){
  const params = parseParams(getHref().split("?")[1]);
  setHref(params[target]);
}
// web通用助手，自定义助手
const matchs = [
  {
    name:'zhihuJump',
    type:'ready',
    url: new RegExp("link.zhihu.com", "i"),
    operate:function(){
      jump('target')
    }
  },
  {
    name:'csdnJump',
    type:'ready',
    url: new RegExp("link.csdn.net", "i"),
    operate:function(){
      jump('target')
    }
  },
  {
    name:'jianshuJump',
    type:'ready',
    url: new RegExp("jianshu.com/go-wild", "i"),
    operate:function(){
      jump('url')
    }
  },
  {
    name:'*',
    type:'ready',
    url: new RegExp(".*", "i"),
    operate: function(){
      function getTime(){
        let time = new Date()
        // if(time.getMinutes() === 0 && time.getSeconds() === 0){
        //   console.log("ding~~")
        // }
        if(time.getSeconds() === 0){
          console.log("ding~~")
        }
      }
      let timer = setInterval(()=>{
        console.log('aaa')
        getTime()
      },1000)
      
      let $pop = $('<div>HAHA</div>')
      $pop.css({
        width:'200px',
        height:'100px',
        position:'fixed',
        // right:'-210px',
        right:'10px',
        top:'100px',
        backgroundColor:'red',
        opacity:'0',
        zIndex:'99999'
      })
      $('body').append($pop)
      $pop.animate({right:'10px',opacity:'1'}, 2000, function() {
        console.log("动画 fontSize执行完毕!");
      })
    }
  },
  {
    name:'**',
    type:'load',
    url: [new RegExp("blog.csdn.net", "i"), new RegExp("jianshu.com", "i")],
    operate: `
      var loop = function(func){
        var loop_time = 10;
        func.interval = setInterval(function(){
          if (func.time){
            if (func.time >= loop_time){
              clearInterval(func.interval);
              return 0;
            }
            func.time += 1;
          } else {
            func.time = 1;
          }
          if (func()){
            clearInterval(func.interval);
            return 0;
          }
        }, 500);
      };
      var main = function(){
        Array.prototype.forEach.call(document.getElementsByTagName("*"), function(el) {
          ["user-select", "-webkit-user-select", "-moz-user-select", "-ms-user-select"].forEach(xcanwin => {
            var filterstyle = document.defaultView.getComputedStyle(el, null)[xcanwin];
            if (filterstyle && filterstyle == 'none') {
              el.style = xcanwin + ": text !important";
            }
          });
    
          ["onselect", "onselectstart", "oncopy", "onbeforecopy", "oncontextmenu"].forEach(xcanwin => {
            el[xcanwin] = function(e) {
              e.stopImmediatePropagation();
            }
          });
        });
      };
      loop(main);
    `,
  },
  {
    name:'zhihu',
    type:'load',
    url: [new RegExp("zhihu.com/question", "i"),new RegExp('zhuanlan.zhihu.com','i')],
    operate: `
      document.querySelectorAll('.Button.Modal-closeButton.Button--plain').forEach(i=>{
        if (i) i.click()
      })
    `
  },
  {
    name:'jianshu',
    type:'load',
    url:new RegExp("jianshu.com/p", "i"),
    operate: `
      document.querySelectorAll('button').forEach(i=>{
        if(i.textContent === '阅读全文'){
          i.click()
        }
      })
    `
  },
  {
    name:'baiduAd',
    type:'load',
    url:new RegExp("baidu.com/s", "i"),
    description:'去除百度广告，根据#content_left盒子下不带className',
    operate: `
      console.log(this)
      const children = document.querySelector('#content_left').children
      for(let i=0;i< children.length;i++){
        if(children[i].className === ''){
          children[i].remove()
        }
      }
    `
  },
  {
    name:'csdn',
    type:'load',
    url:new RegExp("blog.csdn.net/.*/article/details", "i"),
    description:'关注博主展开全文',
    operate:`
      let follow = document.querySelector('#btn-readmore-zk')
      if(follow){
        document.querySelector('#article_content').style.height='auto'
        follow.parentNode.remove()
      }
    `
  }
];

function execute({ href, url, operate }) {
  if (url.test(href)) {
    if(typeof operate === 'function'){
      operate()
    }else{
      (new Function(operate))();
    }
  }
}
function luncher(item){
  const { url, operate } = item,href = getHref();
  if (Array.isArray(url)) {
    url.forEach(j => {
      execute({ href, url: j, operate });
    });
    return 
  }
  execute({ href, url, operate });
}

$(window).on("load", function () {
  matchs.filter(match=>match.type === 'load').forEach(luncher);
});

$(document).ready(function () {
  matchs.filter(match=>match.type === 'ready').forEach(luncher);
});
