function getCardName(cardNum) {
    let output = "";
    switch (cardNum) {
        case 0:
          output = 'ace_of_spades';
          break;
        case 1:
          output = '2_of_spades';
          break;
        case 2:
          output = '3_of_spades';
          break;
        case 3:
          output = '4_of_spades';
          break;
        case 4:
          output = '5_of_spades';
          break;
        case 5:
          output = '6_of_spades';
          break;
        case 6:
          output = '7_of_spades';
          break;
        case 7:
          output = '8_of_spades';
          break;
        case 8:
          output = '9_of_spades';
          break;
        case 9:
          output = '10_of_spades';
          break;
        case 10:
          output = 'jack_of_spades';
          break;
        case 11:
          output = 'queen_of_spades';
          break;
        case 12:
          output = 'king_of_spades';
          break;
        case 13:
          output = 'ace_of_hearts';
          break;
        case 14:
          output = '2_of_hearts';
          break;
        case 15:
          output = '3_of_hearts';
          break;
        case 16:
          output = '4_of_hearts';
          break;
        case 17:
          output = '5_of_hearts';
          break;
        case 18:
          output = '6_of_hearts';
          break;
        case 19:
          output = '7_of_hearts';
          break;
        case 20:
          output = '8_of_hearts';
          break;
        case 21:
          output = '9_of_hearts';
          break;
        case 22:
          output = '10_of_hearts';
          break;
        case 23:
          output = 'jack_of_hearts';
          break;
        case 24:
          output = 'queen_of_hearts';
          break;
        case 25:
          output = 'king_of_hearts';
          break;
        case 26:
          output = 'ace_of_clubs';
          break;
        case 27:
          output = '2_of_clubs';
          break;
        case 28:
          output = '3_of_clubs';
          break;
        case 29:
          output = '4_of_clubs';
          break;
        case 30:
          output = '5_of_clubs';
          break;
        case 31:
          output = '6_of_clubs';
          break;
        case 32:
          output = '7_of_clubs';
          break;
        case 33:
          output = '8_of_clubs';
          break;
        case 34:
          output = '9_of_clubs';
          break;
        case 35:
          output = '10_of_clubs';
          break;
        case 36:
          output = 'jack_of_clubs';
          break;
        case 37:
          output = 'queen_of_clubs';
          break;
        case 38:
          output = 'king_of_clubs';
          break;
        case 39:
          output = 'ace_of_diamonds';
          break;
        case 40:
          output = '2_of_diamonds';
          break;
        case 41:
          output = '3_of_diamonds';
          break;
        case 42:
        output = '4_of_diamonds';
        break;
        case 43:
        output = '5_of_diamonds';
        break;
        case 44:
        output = '6_of_diamonds';
        break;
        case 45:
        output = '7_of_diamonds';
        break;
        case 46:
        output = '8_of_diamonds';
        break;
        case 47:
        output = '9_of_diamonds';
        break;
        case 48:
        output = '10_of_diamonds';
        break;
        case 49:
        output = 'jack_of_diamonds';
        break;
        case 50:
        output = 'queen_of_diamonds';
        break;
        case 51:
        output = 'king_of_diamonds';
        break;
        default:
        output = 'Invalid card number';
    }
    return output;
  }


export default getCardName;