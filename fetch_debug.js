async function checkPorts() {
  const ports = [3000, 3001, 3002, 8080];
  for (const port of ports) {
    try {
      const res = await fetch(`http://localhost:${port}/api/debug542`);
      if (res.ok) {
        console.log(`Porta encontrada: ${port}`);
        const data = await res.json();
        console.log(JSON.stringify(data, null, 2));
        return;
      }
    } catch (e) {
      // ignore
    }
  }
  console.log("Não consegui achar o Next.js em nenhuma dessas portas.");
}

checkPorts();
