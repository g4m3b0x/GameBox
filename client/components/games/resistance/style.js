module.exports = {
  screen: {
    display: 'flex',
    flexDirection: 'column',
  },
  view: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  topArea: {
    height: '30%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  statusBar: {
    height: '25%',
    width: '100%',
    display: 'flex',
  },
  instructions: {
    height: '75%',
    width: '100%',
    display: 'flex',
  },
  genericButton: {
    height: '1.5em',
    marginLeft: '0.5em',
  },
  teamVoteButton: {
    height: '1.5em',
    marginLeft: '0.5em',
  },
  missionVoteButton: {
    height: '3.0em',
    marginLeft: '0.5em',
  }, 
  bottomArea: {
    height: '70%',
    width: '100%',
    display: 'flex',
  },
  playerListArea: {
    height: '100%',
    width: '75%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerListItem: {
    height: '1em',
    width: '90%',
    margin: '0.25em',
    display: 'flex',
    alignItems: 'center',
  },
  playerTokenArea: {
    height: '100%',
    width: '1.4em',
    display: 'flex',
    // justifyContent: 'space-evenly',
  },
  playerToken: {
    height: '1.0em',
  },
  playerGray: {
    borderRadius: '5px',
    border: '1px solid gray',
    backgroundColor: 'lightgray',
  },
  playerBlue: {
    borderRadius: '5px',
    border: '1px solid blue',
    backgroundColor: 'lightblue',
  },
  playerRed: {
    borderRadius: '5px',
    border: '1px solid red',
    backgroundColor: 'pink',
  },
  playerPurple: {
    borderRadius: '5px',
    border: '1px solid purple',
    backgroundColor: 'violet',
  },
  playerName: {
    fontSize: '0.5em',
  },
  gunImage: {
    height: '1.0em',
    marginLeft: '0.5em',
  },
  cardArea: {
    height: '100%',
    width: '25%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardAreaBuffer: {
    flexBasis: '1px',
    flexGrow: '1',
  },
  flipCard: {
    width: '90%',
    height: '0%',
    flexBasis: '2px',
    flexGrow: '2',
  },
  card: {
    width: '100%',
  }
};