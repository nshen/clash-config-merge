# clash-config-merge: Clash 配置合并工具

一个简单的工具，用于解决 Clash 配置在更新或切换机场订阅后自定义规则被覆盖的问题。

通过维护单一的 `custom.yaml` 自定义规则文件，每次机场更新后只需运行一条命令即可生成融合了自定义规则的配置文件。

## 使用方法

### 1. 配置参数

首先修改 `merge-config.js` 文件中的配置路径：

```js
// 配置路径（根据实际情况修改）
const subscriptionFilePath = './subscription.yaml'; // 机场订阅的配置文件路径
const customFilePath = './custom.yaml';             // 自定义规则的配置文件路径
const outputFilePath = './config-build.yaml';       // 输出配置文件路径
```

### 2. 运行命令

执行合并操作：

```bash
node merge-config.js
```

### 3. 使用结果

命令执行后将生成 `config-build.yaml` 文件，该文件包含了机场订阅和自定义规则的合并配置，可直接用于 Clash。
