import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Loading from '../components/Loading';
import Error from '../components/Error';
import { TitlePage } from '../assets/styles/styles';
import { getMovies } from '../services/api/api';


export default function Movies() {

  const [listMovies, setListMovies] = useState(null);

  useEffect(() => {
    getMovies().then((res) => {
        setListMovies(res.data);
      }).catch(() => {
        setListMovies([])
      });
  }, []);

  if (listMovies === null) return <Loading />;
  else if (listMovies.length === 0) return <Error />;

  return (
    <>
      <TitlePage>Selecione o filme</TitlePage>
      <ListMovies>
        {listMovies.map((movie, index) => <Movie key={index} movie={movie} />)}
      </ListMovies>
    </>
  );

}

const Movie = ({ movie }) =>
  <Card>
    <Link to={"/filme/" + movie.id}>
      <img src={movie.posterURL} alt={movie.title} />
    </Link>
  </Card>;

const ListMovies = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  width: 145px;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px 5px 1px #FF9505;
  margin: 10px 15px;
  border-radius: 3px;
  background-color: #c3cfd9;
  img {
    width: 130px;
  }
`;