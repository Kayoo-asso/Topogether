import React, { ReactNode, useEffect, useState } from 'react';
import NextImage from 'next/image';
import { ProfilePicture } from 'components/atoms';
import { Dropdown, DropdownOption } from 'components/molecules/form';
import Link from 'next/link';
import { useAuth } from 'helpers/services';
import { useRouter } from 'next/router';
import { watchDependencies } from 'helpers/quarky';
import ArrowFull from 'assets/icons/arrow-full.svg';

interface HeaderDesktopProps {
  backLink: string,
  title: string,
  menuOptions?: DropdownOption[],
  displayLogin?: boolean,
  displayUser?: boolean,
  children?: ReactNode;
}

// TODO: start showing a loader as soon as a sign out happens?
export const HeaderDesktop: React.FC<HeaderDesktopProps> = watchDependencies(({
  displayLogin = false,
  displayUser = true,
  ...props
}: HeaderDesktopProps) => {
  const auth = useAuth();
  const user = auth.session();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="bg-dark items-center h-header hidden md:flex">
      <Link href={props.backLink}>
        <a className="w-1/12 relative h-[70%] cursor-pointer">
          <NextImage
            src="/assets/img/Logo_white_topogether.png"
            priority
            alt="Logo Topogether"
            layout="fill"
            objectFit="contain"
          />
        </a>
      </Link>

      <div
        className="flex flex-row items-center text-white ktext-title whitespace-nowrap cursor-pointer mr-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {props.title}
        {props.menuOptions && (
          <ArrowFull
            className="fill-white w-4 h-4 rotate-90 ml-[20px] mr-10"
          />
        )}
        {props.menuOptions && menuOpen && (
          <Dropdown
            options={props.menuOptions}
            onSelect={() => setMenuOpen(false)}
            className="top-[7%]"
          />
        )}
      </div>

      <div className="flex-auto flex flex-row items-center">
        {props.children}
      </div>

      {displayLogin && !user &&
        <Link href="/user/login">
          <a className="ktext-base text-white cursor-pointer mr-[3%]">
            Se connecter
          </a>
        </Link>
      }

      {displayUser && user &&
        <div className='w-1/12 flex justify-center items-center'>
          <div className='h-[45px] w-[45px] relative'>
            <ProfilePicture
              image={user?.image}
              onClick={() => setUserMenuOpen(m => !m)}
            />
          </div>
          {userMenuOpen &&
            <Dropdown
              options={[
                { value: 'Mon profil', action: () => router.push('/user/profile') },
                {
                  value: 'Se déconnecter', action: async () => {
                    const success = await auth.signOut();
                    if (success) await router.push('/');
                  }
                }
              ]}
              className='w-[200px] -ml-[180px] mt-[180px]'
            />
          }
        </div>
      }
    </div>
  );
});

HeaderDesktop.displayName = "Header Desktop";