import {
  compose,
  display,
  spacing,
  styled,
} from '@mui/system';

const Image = styled('img')(compose(spacing, display));
Image.defaultProps = {
  display: 'block',
  
};
export default Image; // compose,
// borders,
// display,
// flexbox,
// palette,
// positions,
// shadows,
// sizing,
// spacing,
// typography