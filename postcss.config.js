module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    // Silence deprecated color-adjust warning by rewriting to print-color-adjust
    // Safe: browsers ignore unknown property; this merely renames it for modern PostCSS
    (() => {
      const plugin = () => ({
        postcssPlugin: 'css-color-adjust-to-print-color-adjust',
        Declaration(decl) {
          if (decl.prop === 'color-adjust') {
            decl.prop = 'print-color-adjust';
          }
        },
      });
      plugin.postcss = true;
      return plugin;
    })(),
  ],
};
