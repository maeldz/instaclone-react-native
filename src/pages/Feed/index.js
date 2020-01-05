import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

import api from '../../services/api';

import camera from '../../assets/camera.png';
import more from '../../assets/more.png';
import like from '../../assets/like.png';
import comment from '../../assets/comment.png';
import send from '../../assets/send.png';

import {
  CameraButton,
  CameraImage,
  Container,
  PostList,
  Post,
  PostHeader,
  UserInfo,
  Name,
  Place,
  MoreImage,
  PostImage,
  Footer,
  Actions,
  LikeButton,
  LikeImage,
  CommentButton,
  CommentImage,
  SendButton,
  SendImage,
  Likes,
  Description,
  Hashtags,
} from './styles';

export default function Feed() {
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    async function loadFeed() {
      const response = await api.get('/posts');
      setFeed(response.data);
    }

    loadFeed();
  }, []);

  useEffect(() => {
    const socket = io(api.defaults.baseURL);

    socket.on('post', newPost => {
      setFeed([newPost, ...feed]);
    });

    socket.on('like', likedPost => {
      setFeed(
        feed.map(post => (post._id === likedPost._id ? likedPost : post)),
      );
    });

    return () => {
      socket.off('post');
      socket.off('like');
    };
  }, [feed]);

  function handleLike(id) {
    api.post(`/posts/${id}/like`);
  }

  function renderPost({ item }) {
    return (
      <Post>
        <PostHeader>
          <UserInfo>
            <Name>{item.author}</Name>
            <Place>{item.place}</Place>
          </UserInfo>

          <MoreImage source={more} />
        </PostHeader>
        <PostImage
          source={{ uri: `${api.defaults.baseURL}/files/${item.image.path}` }}
        />

        <Footer>
          <Actions>
            <LikeButton onPress={() => handleLike(item._id)}>
              <LikeImage source={like} />
            </LikeButton>
            <CommentButton onPress={() => {}}>
              <CommentImage source={comment} />
            </CommentButton>
            <SendButton onPress={() => {}}>
              <SendImage source={send} />
            </SendButton>
          </Actions>

          <Likes>{`${item.likes} curtidas`}</Likes>
          <Description>{item.description}</Description>
          <Hashtags>{item.hashtags}</Hashtags>
        </Footer>
      </Post>
    );
  }

  return (
    <Container>
      <PostList
        data={feed}
        keyExtractor={post => post._id}
        renderItem={renderPost}
      />
    </Container>
  );
}

Feed.navigationOptions = ({ navigation }) => ({
  headerRight: () => (
    <CameraButton onPress={() => navigation.navigate('New')}>
      <CameraImage source={camera} />
    </CameraButton>
  ),
});
