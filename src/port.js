// https://github.com/gocreating/express-react-hmr-boilerplate/blob/master/src/server/utils/getPort.js
export default () => {
  const args = process.argv.slice(2);
  const portIndex = args.indexOf('-p');
  let argPort = null;
  if (portIndex >= 0) {
    argPort = parseInt(args[portIndex + 1], 10);
  }
  return process.env.PORT || argPort || 3000;
};
