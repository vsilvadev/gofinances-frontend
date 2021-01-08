import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Ver tamanho do arquivo
import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    const data = new FormData();

    // Se não tiver nada no uploadedFiles manda um return
    if (!uploadedFiles.length) return;

    // pegando as propriedades do arquivo que foi feito upload
    const file = uploadedFiles[0];

    // Vamos enviar o nome do dado junto com o arquivo em si e com o nome do arquivo
    data.append('file', file.file, file.name);
    // TODO

    try {
      await api.post('/transactions/import', data);

      // Define a url para voltar para rota inicial automaticamente
      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  // Recuperar arquivo que foi enviado
  function submitFile(files: File[]): void {
    // Mapear todos os arquivos sendo enviados e pra cada arquivo retornar um objeto com seus dados
    const uploadFiles = files.map(file => ({
      file, // Arquivo
      name: file.name, // Nome do arquivo
      readableSize: filesize(file.size), // Tamanho do arquivo
    }));

    // Enviar arquivos
    setUploadedFiles(uploadFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {/* Se o FileList retornar true (se existir arquivo importado) ele lista os arquivos com o seu tamanho */}
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
