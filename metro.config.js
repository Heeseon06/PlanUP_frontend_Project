const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = defaultConfig.resolver;

  const config = {
    transformer: {
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      // assetExts: [...assetExts, "svg", 'png', 'bin', 'db', 'onnx', 'ort', 'gif'],
      sourceExts: [...sourceExts, "svg"],
    },
  };

  return mergeConfig(defaultConfig, config);
})();
