import Image from 'next/image'

export default function LockDesctop() {
  return (
      <div className="h-screen w-full bg-black text-center flex items-center justify-center pt-4">
          <div className="flex flex-col items-center justify-center">
              <Image src={'/images/logo.svg'} alt="Logo" width={250} height={250} />
              <h3 className="font-bold my-10 mx-10 text-2xl text-white">
                  Пожалуйста, зайдите в приложение с вашего <strong className={'text-blue-500'}>смартфона!</strong>
              </h3>
          </div>
      </div>
  );
}
