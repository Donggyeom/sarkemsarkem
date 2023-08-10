import { useState } from 'react';
import { HeartSwitch } from '@anatoliygatt/heart-switch';
import styled from 'styled-components';
import mute from '../../sound/mute.mp3';
import unmute from '../../sound/unmute.mp3';

const StyledToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const StyledHeartSwitch = styled(HeartSwitch)`
  /* Apply any styles you want here */
  width: 60px; /* Resize */
  height: 30px; /* Resize */
  margin-right: 10px; /* Move left */
`;

export function ToggleButton({ checked, onChange }) {
  const [isChecked, setChecked] = useState(checked);

  const handleToggleChange = (event) => {
    const newCheckedState = event.target.checked;
    setChecked(newCheckedState);

    if (onChange) {
      onChange(newCheckedState);
    }

    const sound = newCheckedState ? unmute : mute;
    const audio = new Audio(sound);
    audio.play();
  };

  return (
    <StyledToggleButton>
      <StyledHeartSwitch
        size="lg"
        checked={isChecked}
        onChange={handleToggleChange}
      />
    </StyledToggleButton>
  );
}

export default ToggleButton;
