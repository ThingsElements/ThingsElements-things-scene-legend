범례 제공자의 범례 정보를 표현해주는 컴포넌트

범례 제공자

- 범례 리스트
- 범례 : 컬러 또는 이미지, 레이블

properties :

- legend <= stockStatus

범례 컴포넌트 특성

- 행 또는 열
- 행열수

범례 컴포넌트는 범례 제공자의 범례 정보 변화이벤트에 리스너를 등록한다.

## build

`$ yarn build`

| type | filename                  | for            | tested |
| ---- | ------------------------- | -------------- | ------ |
| UMD  | things-scene-legend.js    | modern browser | O      |
| UMD  | things-scene-legend-ie.js | ie 11          | O      |
| ESM  | things-scene-legend.mjs   | modern browser | O      |

## publish

`$ yarn publish`
