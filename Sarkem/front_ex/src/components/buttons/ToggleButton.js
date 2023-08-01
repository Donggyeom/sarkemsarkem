// https://reactjsexample.com/a-heart-shaped-toggle-switch-component-for-react/
import { useState } from 'react';
import { HeartSwitch } from '@anatoliygatt/heart-switch';
import styled from 'styled-components';

const StyledToggleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const StyledHeartSwitch = styled(HeartSwitch)`
  /* 여기에 원하는 스타일을 적용하세요 */
  width: 60px; /* 크기 조정 */
  height: 30px; /* 크기 조정 */
  margin-right: 10px; /* 왼쪽으로 이동 */
`;

export function ToggleButton({ checked, onChange }) {
  const [isChecked, setChecked] = useState(checked);

  const handleToggleChange = (event) => {
    setChecked(event.target.checked);
    if (onChange) {
      onChange(event.target.checked);
    }
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
