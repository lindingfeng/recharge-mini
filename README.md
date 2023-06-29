# 全酋付

## 技术栈
Taro@3.6 + Webpack@4/5 + Vue@3 + Pinia@2 + nutui-taro@4.x

## 版本要求
node >= 16

### 安装
```
pnpm install
```

### 开发
```
# 支付宝小程序
pnpm dev:recharge-alipay

# 微信小程序
pnpm dev:recharge-weapp
```

### 构建
```
# 支付宝小程序
pnpm build:recharge-alipay

# 微信小程序
pnpm build:recharge-weapp
```

### 预览
```
# 支付宝小程序
将build/recharge/alipay文件夹导入支付宝开发工具即可

# 微信小程序
将build/recharge/weapp文件夹导入微信开发工具即可
```