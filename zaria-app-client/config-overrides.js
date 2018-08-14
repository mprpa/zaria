const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

module.exports = function override(config, env) {
    config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
    config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@layout-body-background": "#FFFFFF",
            "@layout-header-background": "#e9e2d2",
            "@layout-footer-background": "#FFFFFF",
            "@primary-color" : "#A95E5D",
            "@info-color " : "#cb8a88",
            "@success-color" : "#36c495",
            "@processing-color" : "#6e2220",
            "@error-color" : "#f5222d",
            "@highlight-color" : "#f5222d",
            "@warning-color" : "#fa9a46",
            "@normal-color" : "#F5C6C4"
        },
        javascriptEnabled: true
    })(config, env);
    return config;
};