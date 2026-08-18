const { execSync } = require('child_process');
const r = execSync(
  'psql -U cuidar -d cuidar -h localhost -t -A -c "SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' ORDER BY table_name"',
  { env: { ...process.env, PGPASSWORD: 'cuidar_secret' }, encoding: 'utf8' }
);
console.log(r);
