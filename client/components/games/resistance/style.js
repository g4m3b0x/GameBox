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
  statusBar: {
    height: '25%',
    width: '100%',
  },
  belowStatusBar: {
    height: '75%',
    width: '100%',
    display: 'flex',
  },
  cardArea: {
    height: '100%',
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cardAreaBuffer: {
    flexBasis: '1px',
    flexGrow: '1',
  },
  dynamicArea: {
    height: '100%',
    width: '67%',
    display: 'flex',
    flexDirection: 'column',
  },
  instructionsArea: {
    height: '10%',
    width: '100%',
    display: 'flex',
  },
  playerListArea: {
    height: '90%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerListItem: {
    height: '1em',
    width: '80%',
    margin: '0.25em',
    display: 'flex',
    alignItems: 'center',
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