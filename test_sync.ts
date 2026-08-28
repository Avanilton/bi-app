import { GET } from './src/app/api/sync-cache/route';

async function main() {
  const res = await GET();
  console.log(await res.json());
}
main();
