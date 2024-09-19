const { exec } = require('child_process');
const nomeArquivoPrincipal = 'app.js';


const  startApplications = () => {
    console.log('Inicializando o aplicativo...');
    const processo = exec(`node ${nomeArquivoPrincipal}`);

    processo.stdout.on('data', (dados) => {
        console.log(`Saída: ${dados}`);
    });

    processo.stderr.on('data', (erro) => {
        console.error(`Erro: ${erro}`);
        
    });

    processo.on('close', (código) => {
        console.log(`O aplicativo foi encerrado com código ${código}. Reiniciando...`);
     
        startApplications();
    });
}

startApplications()