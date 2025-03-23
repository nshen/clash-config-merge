const fs = require('fs');
const yaml = require('js-yaml');

// 配置路径（需要根据实际情况修改）
const subscriptionFilePath = './subscription.yaml'; // Clash 解析后的订阅配置文件路径
const customFilePath = './custom.yaml';            // 自定义配置文件路径
const outputFilePath = './config-build.yaml';            // 输出配置文件路径


async function main() {

  // 1. 读取订阅配置文件
  const subscriptionContent = fs.readFileSync(subscriptionFilePath, 'utf8');
  const subscriptionConfig = yaml.load(subscriptionContent);

  // 2. 读取自定义配置文件
  const customContent = fs.readFileSync(customFilePath, 'utf8');
  const customConfig = yaml.load(customContent);

  // 3. 合并 proxies（自定义优先，覆盖重复 name）
  const customProxies = customConfig.proxies || [];
  const subscriptionProxies = subscriptionConfig.proxies || [];
  const customProxyNames = new Set(customProxies.map(p => p.name));
  const mergedProxies = [
    ...customProxies,                                    // 自定义代理优先
    ...subscriptionProxies.filter(p => !customProxyNames.has(p.name))  // 排除重复的订阅代理
  ];

  subscriptionConfig.proxies = mergedProxies;

  // 4. 合并 proxy-groups
  const customProxyGroups = customConfig['proxy-groups'] || [];
  const subscriptionProxyGroups = subscriptionConfig['proxy-groups'] || [];

  // 检查名称冲突
  const subscriptionGroupNames = new Set(subscriptionProxyGroups.map(group => group.name));
  customProxyGroups.forEach(customGroup => {
    if (subscriptionGroupNames.has(customGroup.name)) {
      console.warn(`警告: 自定义 proxy-group "${customGroup.name}" 与订阅中的重名，自定义的将覆盖订阅中的。`);
    }
  });


  // 合并 proxy-groups，自定义的覆盖订阅中的同名组
  const mergedProxyGroups = [
    // 创建一个所有代理的组
    {
      name: "AllProxies",
      type: "select",
      proxies: mergedProxies.map(p => p.name)
    },
    ...customProxyGroups,
    ...subscriptionProxyGroups.filter(p => subscriptionGroupNames.has(p.name))  // 排除重复的订阅代理
  ];


  subscriptionConfig['proxy-groups'] = mergedProxyGroups;

  // 5. 合并 rules，自定义 rules 优先
  const mergedRules = [
    ...(customConfig.rules || []),       // 自定义 rules 优先
    ...(subscriptionConfig.rules || [])  // 订阅 rules
  ];
  subscriptionConfig.rules = mergedRules;

  // 6. 生成新的配置文件
  const mergedConfigContent = yaml.dump(subscriptionConfig);
  fs.writeFileSync(outputFilePath, mergedConfigContent, 'utf8');

  console.log('配置文件合并成功！输出路径：', outputFilePath);
}

// 执行主逻辑
main();
