module.exports = {
  view: {
    height: '100%',
    width: '100%',
    // backgroundColor: 'red',
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-between'
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
    // backgroundColor: 'green',
    display: 'flex',
    flexDirection: 'column',
  },
  instructions: {
    height: '20%',
    width: '100%',
    backgroundColor: 'red',
    display: 'flex',
  },
  information: {
    height: '80%',
    width: '100%',
    backgroundColor: 'blue',
    display: 'flex',
    flexDirection: 'column',
  },
  flipCard: {
    width: '90%',
    height: '0%',
    flexBasis: '2px',
    flexGrow: '2',
  },
  card: {
    width: '100%',
  },
};