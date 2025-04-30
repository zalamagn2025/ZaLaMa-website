import Image from 'next/image';
import React from 'react'
import { twMerge } from 'tailwind-merge';

const testimonials = [
    {
      text: "As a seasoned designer always on the lookout for innovative tools, Framer.com instantly grabbed my attention.",
      imageSrc: "/images/avatar-1.png",
      name: "Jamie Rivera",
      username: "@jamietechguru00",
    },
    {
      text: "Our team's productivity has skyrocketed since we started using this tool. ",
      imageSrc: "/images/avatar-2.png",
      name: "Josh Smith",
      username: "@jjsmith",
    },
    {
      text: "This app has completely transformed how I manage my projects and deadlines.",
      imageSrc: "/images/avatar-3.png",
      name: "Morgan Lee",
      username: "@morganleewhiz",
    },
    {
      text: "I was amazed at how quickly we were able to integrate this app into our workflow.",
      imageSrc: "/images/avatar-4.png",
      name: "Casey Jordan",
      username: "@caseyj",
    },
    {
      text: "Planning and executing events has never been easier. This app helps me keep track of all the moving parts, ensuring nothing slips through the cracks.",
      imageSrc: "/images/avatar-5.png",
      name: "Taylor Kim",
      username: "@taylorkimm",
    },
    {
      text: "The customizability and integration capabilities of this app are top-notch.",
      imageSrc: "/images/avatar-6.png",
      name: "Riley Smith",
      username: "@rileysmith1",
    },
    {
      text: "Adopting this app for our team has streamlined our project management and improved communication across the board.",
      imageSrc: "/images/avatar-7.png",
      name: "Jordan Patels",
      username: "@jpatelsdesign",
    },
    {
      text: "With this app, we can easily assign tasks, track progress, and manage documents all in one place.",
      imageSrc: "/images/avatar-8.png",
      name: "Sam Dawson",
      username: "@dawsontechtips",
    },
    {
      text: "Its user-friendly interface and robust features support our diverse needs.",
      imageSrc: "/images/avatar-9.png",
      name: "Casey Harper",
      username: "@casey09",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9)

const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials
})  => (
    <div 
        className={twMerge(
            'flex flex-col gap-6 mt-10 element',
            props.className
        )}
    >
        {props.testimonials.map(({text, imageSrc, name, username}) => (
            <div key={username} className='card'>
                <div>{text}</div>
                <div className='flex items-center gap-2 mt-5'>
                    <Image
                        src={imageSrc}
                        alt={name}
                        width={40}
                        height={40}
                        className='h-10 w-10 rounded-full'
                    />
                    <div className='flex flex-col'>
                        <div className='font-medium tracking-tight leading-5'>{name}</div>
                        <div className='leading-5 tracking-tight '>{username}</div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)

export const Testimonial = () => {
  return (
    <section className='flex items-center'>
        <div className="container px-6 py-10 mx-auto lg:px-20">
            <div className='section-heading'>
                <div className='flex justify-center'>
                    <div className='tag'>Avis</div>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <h2 className="section-title">Qu&apos;est ce que nos utilisateurs disent ?</h2>
                    <div className="mt-2">
                        <span className="inline-block w-40 h-1 bg-[#10059F] rounded-full"></span>
                        <span className="inline-block w-3 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                        <span className="inline-block w-1 h-1 ml-1 bg-[#10059F] rounded-full"></span>
                    </div>
                    </div>
                <p className='section-description mt-5'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Culpa aspernatur tempore adipisci libero ipsa vitae dolor 
                    iure veritatis commodi vel maxime, quisquam sapiente 
                    voluptatum similique dolores accusantium delectus consequuntur 
                    facilis.
                </p> 
            </div>
            <div className='flex justify-center gap-6'>
                <TestimonialsColumn testimonials={firstColumn}/>
                <TestimonialsColumn 
                    testimonials={secondColumn} 
                    className='hidden md:flex'
                />
                <TestimonialsColumn 
                    testimonials={thirdColumn}
                    className='hidden lg:flex'
                />
            </div>

        </div>
        
    </section>
  )
}
