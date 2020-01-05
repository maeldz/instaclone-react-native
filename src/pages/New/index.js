import React, { useState } from 'react';
import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';

import {
  Container,
  SelectButton,
  SelectButtonText,
  Preview,
  Input,
  ShareButton,
  ShareButtonText,
} from './styles';

export default function New({ navigation }) {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');

  async function handleSubmit() {
    const data = new FormData();

    data.append('image', image);
    data.append('author', author);
    data.append('place', place);
    data.append('description', description);
    data.append('hashtags', hashtags);

    await api.post('/posts', data);
    navigation.navigate('Feed');
  }

  function handleSelectImage() {
    ImagePicker.showImagePicker(
      {
        title: 'Selecionar imagem',
      },
      upload => {
        if (upload.error) {
          return;
        } else if (upload.didCancel) {
          return;
        } else {
          const imagePreview = { uri: `data:image/jpeg;base64,${upload.data}` };

          let prefix;
          let ext;

          if (upload.fileName) {
            [prefix, ext] = upload.fileName.split('.');
            ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
          } else {
            prefix = new Date().getTime();
            ext = 'jpg';
          }

          const imageObject = {
            uri: upload.uri,
            type: upload.type,
            name: `${prefix}.${ext}`,
          };

          setImage(imageObject);
          setPreview(imagePreview);
        }
      },
    );
  }

  return (
    <Container>
      <SelectButton onPress={handleSelectImage}>
        <SelectButtonText>Selecionar imagem</SelectButtonText>
      </SelectButton>

      {preview && <Preview source={preview} />}

      <Input
        autoCorrect={false}
        autoCaptalize="none"
        placeholder="Nome do autor"
        placeholderTextColor="#999"
        value={author}
        onChangeText={setAuthor}
      />
      <Input
        autoCorrect={false}
        autoCaptalize="none"
        placeholder="Local da foto"
        placeholderTextColor="#999"
        value={place}
        onChangeText={setPlace}
      />
      <Input
        autoCorrect={false}
        autoCaptalize="none"
        placeholder="Descrição"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
      />
      <Input
        autoCorrect={false}
        autoCaptalize="none"
        placeholder="Hashtags"
        placeholderTextColor="#999"
        value={hashtags}
        onChangeText={setHashtags}
      />

      <ShareButton onPress={handleSubmit}>
        <ShareButtonText>Compartilhar</ShareButtonText>
      </ShareButton>
    </Container>
  );
}

New.navigationOptions = {
  headerTitle: 'Nova publicação',
};
