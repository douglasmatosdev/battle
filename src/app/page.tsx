'use client'
import Image from "next/image";
import { createRef, useState, useMemo } from "react";
import styled from "styled-components";
import Confetti from 'react-confetti'

type Hero = {
  battleIndex?: number;
  player?: Player;
  image: string;
  name: string;
  power: number;
}

type Player = 'left' | 'right'

const deck = [
  {
    image: '/hero.jpeg',
    name: 'john',
    power: 3
  },
  {
    image: '/hero.jpeg',
    name: 'jane',
    power: 5
  },
  {
    image: '/hero.jpeg',
    name: 'jim',
    power: 2
  },
  {
    image: '/hero.jpeg',
    name: 'jill',
    power: 4
  },
]

const initialPlayers = { left: deck.slice(0, 2), right: deck.slice(2, 4) }
export default function Home() {
  const [players, setPlayers] = useState<{ left: Hero[]; right: Hero[] }>(initialPlayers)
  const [inBattle, setInBattle] = useState<Hero[]>([])
  const [cemitery, setCemitery] = useState<Hero[]>([])
  const [scores, setScores] = useState<{ left: number; right: number }>({ left: 0, right: 0 })
  const [isExploding, setIsExploding] = useState(false);

  const herosInBattleRef = useMemo(() => Array.from({ length: 2 }).fill(0).map(() => createRef<HTMLDivElement>()), []);

  const handleClick = (player: Player, card: Hero) => {
    if (inBattle.length < 2 && !inBattle.find((c) => player === c.player)) {
      let newInBattle = [...inBattle, { player, ...card }]
      newInBattle = newInBattle.map((c, index) => ({ ...c, battleIndex: index }))
      setInBattle(newInBattle)
      setPlayers({
        ...players,
        [player]: players[player].filter((c) => c.name !== card.name)
      })

      setTimeout(() => {
        handleBattle(newInBattle)
      }, 2000)
    }
  }

  const handleBattle = (inBattle: Hero[]) => {
    if (inBattle.length === 2) {
      const leftHero = inBattle.find((c) => c.player === 'left')
      const rightHero = inBattle.find((c) => c.player === 'right')

      if (leftHero!.power > rightHero!.power) {
        herosInBattleRef[leftHero!.battleIndex!].current?.classList.add('hero-winner')

        setTimeout(() => {
          setScores({
            ...scores,
            left: scores.left + 1
          })

          const updatedRight = players.right.filter((c) => c.name !== rightHero?.name)
          const updatedLeft = [...players.left, leftHero!].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)

          setPlayers({
            left: updatedLeft,
            right: updatedRight
          })

          setCemitery([...cemitery, rightHero!])

          if (updatedRight.length === 0) {
            setTimeout(() => {
              alert('PLAYER LEFT WINS')
              setIsExploding(true)

              setTimeout(() => {
                setIsExploding(false)
                alert('RESTARTING GAME')
                setPlayers(initialPlayers)
                setCemitery([])
                setScores({ left: 0, right: 0 })
                setInBattle([])
              }, 5000)
            }, 500)
          }
        }, 2000)
      } else {
        herosInBattleRef[rightHero!.battleIndex!].current?.classList.add('hero-winner')

        setTimeout(() => {
          setScores({
            ...scores,
            right: scores.right + 1
          })

          const updatedLeft = players.left.filter((c) => c.name !== leftHero?.name)
          const updatedRight = [...players.right, rightHero!].filter((v, i, a) => a.findIndex(t => t.name === v.name) === i)

          setPlayers({
            left: updatedLeft,
            right: updatedRight
          })

          setCemitery([...cemitery, leftHero!])

          if (updatedLeft.length === 0) {
            setTimeout(() => {
              alert('PLAYER RIGHT WINS')
              setIsExploding(true)

              setTimeout(() => {
                setIsExploding(false)
                alert('RESTARTING GAME')
                setPlayers(initialPlayers)
                setCemitery([])
                setScores({ left: 0, right: 0 })
                setInBattle([])
              }, 5000)
            }, 500)
          }

        }, 2000)
      }

      setTimeout(() => {
        setInBattle([])
      }, 2000)
    }
  }

  return (
    <div>
      {isExploding && <Confetti
        width={document.documentElement.clientWidth}
        height={document.documentElement.clientHeight}
      />}
      <Board>

        <BattleField>
          <CemiteryField>
            <span>Cemitery</span>
            <div>
              {cemitery.map((card, index) => (
                <Card className="in-cemitery" ref={herosInBattleRef[index]} key={'cemitery' + index + card.name} onClick={() => handleClick('left', card)}>
                  <Image src={card.image} alt={card.name} width={50} height={100} />
                  <p>{card.name}</p>
                  <p>{card.power}</p>
                </Card>
              ))}
            </div>
          </CemiteryField>

          <BattleFieldMatch>
            {inBattle.map((card, index) => (
              <Card ref={herosInBattleRef[index]} key={'battle' + index + card.name} onClick={() => handleClick('left', card)}>
                <Image src={card.image} alt={card.name} width={200} height={200} />
                <p>{card.name}</p>
                <p>{card.power}</p>
              </Card>
            ))}
          </BattleFieldMatch>
        </BattleField>
        <PlayersDecks>
          <BoardSide >
            <BoardSideArea>
              <p>Player: LEFT</p>
              <p>Score: {scores.left}</p>
            </BoardSideArea>
            <div>

              {players.left.map((card, index) => (
                <Card key={'players-left' + index + card.name} onClick={() => handleClick('left', card)}>
                  <Image src={card.image} alt={card.name} width={200} height={200} />
                  <p>{card.name}</p>
                  <p>{card.power}</p>
                </Card>
              ))}
            </div>
          </BoardSide>
          <BoardSide >
            <BoardSideArea>
              <p>Player: RIGHT</p>
              <p>Score: {scores.right}</p>
            </BoardSideArea>
            <div>

              {players.right.map((card, index) => (
                <Card key={'playr-right' + index + card.name} onClick={() => handleClick('right', card)}>
                  <Image src={card.image} alt={card.name} width={200} height={200} />
                  <p>{card.name}</p>
                  <p>{card.power}</p>
                </Card>
              ))}
            </div>
          </BoardSide>
        </PlayersDecks>
      </Board>
    </div>

  );
}
const BattleFieldMatch = styled.div`
display: flex;
gap: 16px;

`

const CemiteryField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 150px;

  background: brown;
  padding: 16px;

  & > div {
    display: flex;
    gap: 16px;
  }
`

const BoardSideArea = styled.div`
  display: flex;
`
const BattleField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 500px;
  background: red;
  border-radius: 8px;
  padding: 16px;
`
const PlayersDecks = styled.div`
  display: flex;
  gap: 16px;


  width: 100%;
  height: 300px;
  position: fixed;
  bottom: 0;
  left: 0;
`


const BoardSide = styled.div`
    width: 50%;
    background: blue;
    border-radius: 8px;
    padding: 16px;
  & > div {

    display: flex;
    justify-content: center;
    gap: 16px;
  }
`
const Board = styled.div`
padding: 16px;

`
const Card = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background: #fff;

  
  width: 200px;
  height: 250px;
  
  p {
    color: #333;
    font-size: 24px;
    margin: 16px 0;
    border: 1px solid #333;
    width: 100%;
    text-align: center;
  }
  
  &.hero-winner {
    transform: scale(1.5);
  }

  &.in-cemitery {
    padding: 4px;
    border-radius: 2px;
    width: 50px;
    height: 100px;

    p {
    color: #333;
    font-size: 16px;
    margin: 4px 0;
  }
  }
`
