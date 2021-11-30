import styled from "styled-components";
import React, { useState, useEffect, useContext } from "react";
import { TitlePage, Button, Container } from "../assets/styles/styles";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Error from "../components/Error";
import Seat from "../components/Seat";
import InputsBuyer from "../components/InputsBuyer";
import { getSeats, makeBooking } from "../services/api/api";
import { BookingContext } from "../contexts/bookingContext";

export default function Seats() {
  const [seatsList, setSeatsList] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { showtimeId } = useParams();

  const { booking, setBooking } = useContext(BookingContext);

  useEffect(() => {
    getSeats(showtimeId)
      .then((res) => {
        const seats = res.data.seats.map((seat) => seat);
        setBooking({
          ...booking,
          showtime: res.data,
        });
        setSeatsList(seats);
      })
      .catch(() => setSeatsList([]));
  }, []);

  function handleSelectSeat(seatId) {
    if (buyerInfo.some((b) => b.idAssento === seatId)) {
      setBuyerInfo(buyerInfo.filter((b) => b.idAssento !== seatId));
      drawSelectSeat(seatId, true);
    } else {
      setBuyerInfo([...buyerInfo, { idAssento: seatId, nome: "", cpf: "" }]);
      drawSelectSeat(seatId, null);
    }
  }

  function drawSelectSeat(seatId, type) {
    const seatIndex = seatsList.findIndex((s) => s.id === seatId);
    const newSeatsList = seatsList.filter((s) => s.id !== seatId);

    setSeatsList(
      [
        ...newSeatsList,
        { id: seatId, name: `${seatIndex + 1}`, isAvailable: type },
      ].sort((a, b) => a.name - b.name)
    );
  }

  if (seatsList === null) return <Loading />;
  else if (seatsList.length === 0) return <Error />;

  return (
    <Container>
      <TitlePage>Selecione o(s) assentos(s)</TitlePage>
      <div>
        <ScreenContainer>TELA</ScreenContainer>
        <ContainerSeats>
          {seatsList.map(({ id, name, isAvailable }, index) => (
            <li key={id} onClick={() => handleSelectSeat(id)}>
              <Seat available={isAvailable}>{name}</Seat>
            </li>
          ))}
        </ContainerSeats>

        <ContainerOptions>
          <Seat available={null} showText />
          <Seat available={true} showText />
          <Seat available={false} showText />
        </ContainerOptions>
      </div>
      <br />
      {buyerInfo.map((b, index) => (
        <InputsBuyer
          key={b.idAssento}
          buyerInfo={buyerInfo}
          setBuyerInfo={setBuyerInfo}
          index={index}
          seatName={seatsList.find((s) => s.id === b.idAssento).name}
        />
      ))}
      {buyerInfo.length && (
        <ButtonReservation
          onClick={() => {
            setIsLoading(true);
            const objectBooking = {
              ids: buyerInfo.map((b) => b.idAssento),
              compradores: buyerInfo,
            }
            makeBooking(objectBooking)
              .then(() => {
                objectBooking.compradores.forEach((b) => {
                  b.seatName = seatsList.find((s) => s.id === b.idAssento).name;
                });
                setBooking({
                  ...booking,
                  buyers: objectBooking.compradores
                })
                navigate("/sucesso");
              })
              .catch(() => alert("Ocorreu um erro ao realizar a reserva."))
              .then(() => setIsLoading(false));
          }}
        >
          Reservar assento(s)
        </ButtonReservation>
      )}
    </Container>
  );
}

const ScreenContainer = styled.div`
  width: 345px;
  height: 15px;
  margin-bottom: 5px;
  background-color: white;
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  border-radius: 3px;
`;

const ContainerSeats = styled.ul`
  width: 350px;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 0 auto;

  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 13px;
  }
`;

const ContainerOptions = styled(ContainerSeats)`
  height: auto;
  width: 100%;
  justify-content: space-around;
  padding: 0 10%;
  margin-top: 5px;
`;

const ButtonReservation = styled(Button)`
  margin-top: 10px;
  width: 210px;
  background-color: #000;
  box-shadow: 0px 0px 5px 0px #ff9505;
`;
