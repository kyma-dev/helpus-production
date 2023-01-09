import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { __getHelperTrue } from "../../../../redux/modules/postSlice";
import Card from "../../../../components/Card";
const HelperTrue = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.postSlice.helperTrueDate.result)
  // console.log('useSelect 헬퍼 true:', data)



  useEffect(() => { dispatch(__getHelperTrue()) }, [dispatch])

  return (<>
    <StHelpeeWrapper>
      헬퍼(로컬)
      {data?.map((item, idx) => { return (<Card type={'세로'} data={item} key={idx} />) })}

    </StHelpeeWrapper>
  </>)
}
export default HelperTrue;
const StHelpeeWrapper = styled.div`
width:95%;
margin:auto;
  border:1px solid #000;
`