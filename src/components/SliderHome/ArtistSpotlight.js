import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import React, { memo, useEffect, useState } from "react"
import { Navigation, Autoplay, Pagination } from "swiper"
import { Swiper, SwiperSlide } from "swiper/react"
import { useGetHomePage } from "../../api/getHomePage"
import LoadingSkeleton from "../loading/LoadingSkeleton"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { dataAritsHomePage } from "../../data/dataArtisHomePage"
import { Link } from "react-router-dom"
const ArtistSpotlight = memo(() => {
   const [datas, setData] = useState(null)

   useEffect(() => {
      if (!datas) {
         setData(dataAritsHomePage)
      }
   }, [])

   const navigationPrevRef = React.useRef(null)
   const navigationNextRef = React.useRef(null)
   return (
      <div className="container_choice">
         <div className="choice_list">
            <Swiper
               modules={[Navigation, Autoplay, Pagination]}
               autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
               }}
               loopFillGroupWithBlank={true}
               loop={true}
               spaceBetween={2}
               slidesPerView={7}
               pagination={{
                  dynamicBullets: true,
               }}
               navigation={{
                  prevEl: navigationPrevRef.current,
                  nextEl: navigationNextRef.current,
               }}
               onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = navigationPrevRef.current
                  swiper.params.navigation.nextEl = navigationNextRef.current
               }}
               speed={600}
               allowTouchMove={false}
               scrollbar={{ draggable: false }}
               breakpoints={{
                  0: {
                     slidesPerView: 3,
                     allowTouchMove: true,
                     slidesPerGroup: 3,
                     navigation: false,
                     loopFillGroupWithBlank: true,
                  },
                  700: {
                     slidesPerGroup: 4,
                     slidesPerView: 4,
                     loopFillGroupWithBlank: true,
                  },
                  850: {
                     slidesPerGroup: 4,
                     slidesPerView: 5,
                     loopFillGroupWithBlank: true,
                  },
                  1220: {
                     slidesPerGroup: 6,
                     slidesPerView: 6,
                     loopFillGroupWithBlank: true,
                  },
                  1320: {
                     slidesPerGroup: 7,
                     slidesPerView: 7,
                     loopFillGroupWithBlank: true,
                  },
               }}
            >
               {datas &&
                  datas.length > 0 &&
                  datas.map((e, index) => {
                     const img = e.img.slice(e.img.lastIndexOf("/"))

                     return (
                        <SwiperSlide key={index}>
                           <div className="choice_list-item slick-slide slick-cloned slick-active cursor-pointer">
                              <a className="choice_list-item-link">
                                 <LazyLoadImage visibleByDefault={e.img === img} src={e.img} alt="" />
                              </a>
                           </div>
                        </SwiperSlide>
                     )
                  })}
               <>
                  <button
                     ref={navigationPrevRef}
                     type="button"
                     className="choice-btn-left slick-prev slick-arrow"
                     style={{ display: "flex" }}
                  >
                     <span className="material-icons-outlined">arrow_back_ios</span>
                  </button>
                  <button
                     ref={navigationNextRef}
                     type="button"
                     className="choice-btn-right slick-next slick-arrow"
                     style={{ display: "flex" }}
                  >
                     <span className="material-icons-outlined">arrow_forward_ios</span>
                  </button>
               </>
            </Swiper>
         </div>
      </div>
   )
})

export default ArtistSpotlight
