import React, { memo, useState } from "react"
import ItemRighPlayer from "../../components/Item/ItemRighPlayeQueue"
import { useSelector, useDispatch } from "react-redux"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { useEffect } from "react"
import {
   setDraggItemActive,
   setDraggUpdateList,
   setListSongShuffle,
   setNextSong,
   setDraggItemActiveShuffle,
   setDraggUpdateListShuffle,
   setNextSongShuffle,
} from "../../features/QueueFeatures/QueueFeatures"
import lodash from "lodash"
import { v4 as uuidv4 } from "uuid"

import scrollIntoView from "smooth-scroll-into-view-if-needed"
import { useLayoutEffect } from "react"
import { useCallback } from "react"

const reorder = (list, startIndex, endIndex) => {
   const result = Array.from(list)
   const [removed] = result.splice(startIndex, 1)
   result.splice(endIndex, 0, removed)
   return result
}

const BottomRight = () => {
   const isToggle = useSelector((state) => state.toggleright)

   const listSong = useSelector((state) => state.queueNowPlay.listSong)
   const currentIndexSong = useSelector((state) => state.queueNowPlay.currentIndexSong)
   const infoSongCurrent = useSelector((state) => state.queueNowPlay.infoSongCurrent)
   const currentEncodeId = useSelector((state) => state.queueNowPlay.currentEncodeId)
   const playlistEncodeId = useSelector((state) => state.queueNowPlay.playlistEncodeId)

   const recentSongs = useSelector((state) => state.logged.recentSongs)

   const { isRandom } = useSelector((state) => state.setting)
   const [toggleSilde, setToggleSilde] = useState(false)
   const [items, setItems] = useState([])
   const dispatch = useDispatch()

   useLayoutEffect(() => {
      setItems(listSong)
   }, [listSong])

   useLayoutEffect(() => {
      if (isRandom && listSong.length > 0) {
         let arrNext = listSong.filter((e) => e.encodeId !== infoSongCurrent.encodeId)
         let arrShuffle = [infoSongCurrent, ...lodash.shuffle(arrNext)]
         dispatch(setListSongShuffle(arrShuffle))
         setItems(arrShuffle)
      }

      if (!isRandom) {
         const indexCurrentSongActive = listSong.indexOf(infoSongCurrent)
         setItems(listSong)
         dispatch(setNextSong(indexCurrentSongActive))
      }
   }, [isRandom, playlistEncodeId])

   useLayoutEffect(() => {
      let node = document.querySelector(`div[data-rbd-draggable-id='${currentEncodeId}']`)
      if (!node) return

      setTimeout(() => {
         scrollIntoView(node, {
            block: "center",
            behavior: "smooth",
            scrollMode: "if-needed",
         })
      }, 200)
   }, [currentEncodeId, isRandom, playlistEncodeId, toggleSilde])

   useEffect(() => {
      let node = document.querySelector(`div[data-rbd-draggable-id='${currentEncodeId}']`)
      if (!node) return

      setTimeout(() => {
         scrollIntoView(node, {
            block: "center",
            behavior: "smooth",
            scrollMode: "if-needed",
         })
      }, 200)
   }, [])

   const onDragEnd = useCallback(
      (result) => {
         const { destination, source } = result

         if (!destination) {
            return
         }

         const reorderedItems = reorder(items, source.index, destination.index)

         let indexActive = reorderedItems.find((e) => e.encodeId === currentEncodeId)
         if (!isRandom) {
            if (source.index === currentIndexSong) {
               dispatch(setDraggItemActive(destination.index))
            }
            setItems(reorderedItems)
            dispatch(setNextSong(reorderedItems.indexOf(indexActive)))
            dispatch(setDraggUpdateList(reorderedItems))
         }
         if (isRandom) {
            if (source.index === currentIndexSong) {
               dispatch(setDraggItemActiveShuffle(destination.index))
            }
            setItems(reorderedItems)
            dispatch(setNextSongShuffle(reorderedItems.indexOf(indexActive)))
            dispatch(setDraggUpdateListShuffle(reorderedItems))
         }
      },
      [items, currentEncodeId, isRandom]
   )

   return (
      <div className={`player_queue ${isToggle ? "player_queue-is_active" : ""}`}>
         <div className="player_queue-main">
            <div className="player_queue-header gap-1">
               <div className="queue_list-history">
                  <div onClick={() => setToggleSilde(false)} className={`queue_list ${!toggleSilde && "queue_active-top"}`}>
                     Danh sách phát
                  </div>
                  <div onClick={() => setToggleSilde(true)} className={`queue_histrory ${toggleSilde && "queue_active-top"}`}>
                     Nghe gần đây
                  </div>
               </div>
               <div className="queue_list-btn">
                  <div className="player_btn queue_time">
                     <span className="material-icons-outlined"> alarm </span>
                     <div className="playing_title-hover">Hẹn giờ</div>
                  </div>
                  <div className="player_btn queue_more">
                     <span className="material-icons-outlined"> more_horiz </span>
                     <div className="playing_title-hover">Khác</div>
                  </div>
               </div>
            </div>
            <div className="player_queue-container">
               {!toggleSilde && (
                  <DragDropContext onDragEnd={onDragEnd}>
                     <Droppable droppableId="droppable">
                        {(provoied, snapshot) => {
                           return (
                              <ul className="player_queue-listmusic" {...provoied.droppableProps} ref={provoied.innerRef}>
                                 {items &&
                                    items?.length > 0 &&
                                    items?.map((e, index) => {
                                       let lastIndex = false

                                       if (index + 1 === items.length) {
                                          lastIndex = true
                                       }

                                       return (
                                          <ItemRighPlayer
                                             lastIndex={lastIndex}
                                             key={e.encodeId}
                                             index={index}
                                             data={e}
                                          ></ItemRighPlayer>
                                       )
                                    })}
                              </ul>
                           )
                        }}
                     </Droppable>
                  </DragDropContext>
               )}

               {toggleSilde && (
                  <ul className="player_queue-listmusic">
                     {recentSongs &&
                        recentSongs?.length > 0 &&
                        recentSongs?.map((e, index) => {
                           return (
                              <ItemRighPlayer
                                 setToggleSilde={setToggleSilde}
                                 items={items}
                                 key={e.encodeId}
                                 index={index}
                                 isHistory={true}
                                 data={e}
                              ></ItemRighPlayer>
                           )
                        })}
                  </ul>
               )}
            </div>
         </div>
      </div>
   )
}

export default memo(BottomRight)
