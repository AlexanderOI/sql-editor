import React from "react"
import { useEffect, useState, useRef } from "react"
import styled, { css } from "styled-components"

const FlexCenter = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Container = styled.div`
  /* ${FlexCenter} */
  display: flex;

  justify-content: none;
  flex-direction: column;
  background-color: #363636;
  width: 100%;
  height: 100vh;
`

const Title = styled.div`
  ${FlexCenter}
  background-color: #5789ca;
  border-radius: 5px 5px 0px 0px;
  /* width: 60%; */
  width: 90%;
  height: 50px;
`

const EditorStyle = styled.div`
  display: flex;
  background-color: #1a1a1a;
  width: 90%;
  height: 50%;
`

const Aside = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #738fb4;
  padding-top: 5px;
  height: 100%;
  width: 40px;
`

const Main = styled.div`
  position: relative;
  width: calc(100% - 40px);
  height: 100%;
  padding: 5px;
  cursor: text;

`

const TextLine = styled.span`
  white-space: pre-wrap;
`

const Line = styled.div`
  position: absolute;
  background-color: rgba(87, 211, 248, 0.3);
  width: calc(100% - 10px);
  height: 21px;
  top: 6px;
`

const Textarea = styled.textarea`
  position: absolute;
  background-color: transparent;
  resize: none;
  border: none;
  outline: none;
  padding-left: 1px;
  padding-top: 4px;
  width: 15px;
  height: 21px;
  top: 6px;
  
`
function App() {
  const [topLine, setTopLine] = useState(6)
  const [leftLine, setLeftLine] = useState(6)

  const [editorValue, SetEditorValue] = useState('')
  const [text, setText] = useState<string[][]>([['']])
  const [numLine, setNumLine] = useState(0)
  const [textSpanLine, setTextSpanLine] = useState<JSX.Element[]>()

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const numLineRef = useRef(numLine)

  const handleClickTextFocus = () => {
    textareaRef.current?.focus()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)

    return () => { window.addEventListener('keydown', handleKeyPress) }
  }, [])

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      event.preventDefault();
      setText((prev) => {
        return prev.map((arrayText, index) => {
          if (index === numLineRef.current) {
            return [arrayText[0].replace(/\n/g, '')];
          }
          return arrayText;
        });
      });
      setTopLine((prev) => prev + 21)
      setNumLine((prev) => prev + 1)
      setText((prev) => [...prev, ['']]);

    } else if (event.key === 'Backspace') {
      setText((prev) => prev.map((arrayText, index) => {
        if (index === numLineRef.current) {
          let string = arrayText[0].slice(0, -1)
          return [string]
        }
        return arrayText
      }))
    }
  }

  const handleChangeText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value
    setText((prev) => prev.map((arrayText, index) => {
      if (index === numLine) {
        let string = arrayText[0] + value

        return [string]
      }
      return arrayText;
    }))
    SetEditorValue('')
  }

  useEffect(() => {
    const newText = text.map((textLine, index) => (
      <>< TextLine key={'line' + index} id={`line${index.toString()}`}>{textLine}</TextLine><br /></>
    ))
    setTextSpanLine(newText)

  }, [text])

  useEffect(() => {
    const spanLine = document.getElementById('line' + numLine.toString())
    if (spanLine) {

      const width = spanLine.offsetWidth
      setLeftLine(width + 6)
    }
  }, [textSpanLine])

  useEffect(() => {
    numLineRef.current = numLine
  }, [numLine])

  let asideNum: JSX.Element[] = []
  for (let i = 0; i < numLine + 1; i++) {
    asideNum.push(<span key={'aside' + i}>{i + 1}</span>);
  }

  return (
    <Container>
      <Title>
        <h2>SQL Editor</h2>
      </Title>
      <EditorStyle>
        <Aside>
          {asideNum}
        </Aside>
        <Main onClick={handleClickTextFocus}>
          {textSpanLine}
          <Textarea
            ref={textareaRef}
            value={editorValue}
            onChange={handleChangeText}
            name="editor"
            id="editor"
            style={{ top: `${topLine}px`, left: `${leftLine}px` }}
          />

          <Line style={{ top: `${topLine}px` }}></Line>
        </Main>
      </EditorStyle>
    </Container>
  )
}

export default App
