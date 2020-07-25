define({ "api": [
  {
    "type": "post",
    "url": "/login",
    "title": "",
    "group": "account",
    "description": "<p>登陆</p>",
    "version": "1.0.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>用户名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "psw",
            "description": "<p>密码 两重MD5</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " {  \n  code: 200 ,\n  msg: 'ok',\n  res: {\n     \"token\": \"abcdefghijk\",\n     \"userId\": 1111111,\n     \"userName\": \"张三\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "router/login.js",
    "groupTitle": "account",
    "name": "PostLogin"
  }
] });
