# panda-assistant
This is an assistant for your chrome

"page_action":{
  "default_icon":{
    "24":"images/panda-24.png",
    "38":"images/panda-38.png"
  },
  "default_popup": "html/popup.html",
  "default_title":"Hello Panda"
},

* page scripts 只能指定一个
"background": {
  "page": "html/background.html",
  "scripts": [
    "scripts/background.js",
    "scripts/devtools-page.js"
  ]
},