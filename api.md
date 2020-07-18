
# APK管理平台

## 服务器地址

### 宿舍 192.168.0.112:3000

### 公司 代补充

> # 1: 获取apk列表

|  url      | /getApkList |
|:---------:|:---------:|
|  请求方式  | get  |
| 请求参数  | 无 |
| 返回格式  | 见下表 |

```javascript
{
    "code": 200,
    "msg": "ok",
    "result": [
        {
            "startTime": 1594734688756,
            "endTime": 1594745488756,
            "version": 0,
            "describe": "我是描述",
            "user": "张三"
        }
    ]
}
```
