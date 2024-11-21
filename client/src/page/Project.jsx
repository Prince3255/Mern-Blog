import React from 'react'
import { Button } from 'flowbite-react'
import ShopNova from '../assets/ShopNova.png'
import GlobeTalk from '../assets/GlobeTalk.png'
import Lazarev from '../assets/Lazarev.png'

export default function Project() {
  return (
    <div className='min-h-screen max-w-4xl mx-auto justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Project</h1>
      <p className='text-md text-gray-500 mt-2'>I have build many project while learning web development. Here are some of them.</p>
      <div className='flex flex-col flex-wrap justify-center gap-5'>
      <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center gap-y-5 mt-5'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl font-semibold'>
               Introducing Shop Nova!
            </h2>
            <p className='text-gray-500 my-2'>
              Shop Nova is a modern, user-friendly e-commerce platform built to provide a seamless online shopping experience. 
            </p>
                <a href="https://shop-nova.vercel.app/" target='_blank' rel='noopener noreferrer' className='block w-full'>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none w-full'>
                  View Shop Nova
            </Button>
                </a>
        </div>
        <div className='p-7 flex-1'>
            <img src={ShopNova} alt='' />
        </div>
      </div>
      <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center gap-y-5 mt-5'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl font-semibold'>
               Introducing Globe Talks!
            </h2>
            <p className='text-gray-500 my-2'>
            A dynamic news platform designed to keep you informed with the latest headlines from around the world 
            </p>
                <a href="https://globe-talks.vercel.app/" target='_blank' rel='noopener noreferrer' className='block w-full'>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none w-full'>
                  View Globe Talks
            </Button>
                </a>
        </div>
        <div className='p-7 flex-1'>
            <img src={GlobeTalk} alt='' />
        </div>
      </div>
      <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center gap-y-5 mt-5'>
        <div className='flex-1 justify-center flex flex-col'>
            <h2 className='text-2xl font-semibold'>
               Introducing Lazarev UI Clone!
            </h2>
            <p className='text-gray-500 my-2'>
            Lazarev Agency is a renowned digital agency specializing in creating visually stunning and highly functional websites 
            </p>
                <a href="https://prince3255.github.io/Lazarev_agency_Clone/" target='_blank' rel='noopener noreferrer' className='block w-full'>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none w-full'>
                  View Lazarev Agency
            </Button>
                </a>
        </div>
        <div className='p-7 flex-1'>
            <img src={Lazarev} alt='' />
        </div>
      </div>
    </div>
    </div>
  )
}
