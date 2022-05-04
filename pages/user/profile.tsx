import React, { useCallback, useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Button, ImageInput, ProfileForm, TextInput, LikedList, DownloadedList } from 'components';
import { LeftbarDesktop, Tabs } from 'components/layouts';
import { useCreateQuark, watchDependencies } from 'helpers/quarky';
import { DBLightTopo, LightTopo, Name, User } from 'types';
import { api, useAuth } from "helpers/services";
import { loginRedirect } from 'helpers/auth';
import { Header } from 'components/layouts/header/Header';
import Profile from 'assets/icons/user-mobile.svg';
import Heart from 'assets/icons/heart.svg';
import Download from 'assets/icons/download.svg';
import { quarkifyLightTopos, staticUrl, useModal } from 'helpers';
import { getServerUser } from 'helpers/getServerUser';

type ProfileProps = {
  user: User,
  likedTopos: DBLightTopo[],
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async ({ req }) => {
  const session = await getServerUser(req.cookies);
  if (!session) {
    return loginRedirect("/user/profile");
  }
  const likedTopos = await api.getLikedTopos(session.id);
  return { props: { likedTopos, user: session } }
}

const ProfilePage: NextPage<ProfileProps> = watchDependencies((props) => {
  const auth = useAuth();
  const userQuark = useCreateQuark(props.user);
  const user = userQuark();

  const [selectedTab, setSelectedTab] = useState<'PROFILE' | 'LIKED' | 'DOWNLOADED'>('PROFILE');
  const [likedTopos, setLikedTopos] = useState(props.likedTopos);

  const [userNameError, setUserNameError] = useState<string>();

  const unlikeTopo = useCallback((topo: LightTopo) => {
    if (topo) {
      topo.liked.set(false);
      const newLikedTopos = likedTopos.filter(t => t.id !== topo.id);
      setLikedTopos(newLikedTopos);
    }
}, [likedTopos]);

const [ModalDelete, showModalDelete] = useModal();
  const deleteAccount = () => {
    alert("à venir"); //TODO
    console.log("delete account");
  }

  return (
    <>
      <Header
          backLink="/"
          title="Profile"
      />

      <div className='w-full h-content md:h-full flex flex-row bg-white overflow-auto'>
        <LeftbarDesktop
          currentMenuItem="USER"
        />
        
        <div className='flex flex-col relative w-full h-full justify-start overflow-x-hidden md:px-12'>
          
          <div className='flex flex-row justify-center md:justify-start rounded-lg px-6 pb-8 md:pb-12 pt-12 md:pt-[16px]'>
            <div className='h-[100px] w-[100px] relative cursor-pointer'>
              <ImageInput 
                profileImageButton
                value={userQuark().image}
                onChange={async (images) => {
                  userQuark.set({
                    ...userQuark(),
                    image: images[0]
                  });
                  await auth.updateUserInfo(userQuark());
                }}
              />
            </div>
            
            <div className='hidden md:flex flex-col ml-6 w-1/2'>
              <div className='mb-6'>
                <div className='ktext-subtitle'>{user.userName}</div>
                {user.role === 'ADMIN' && <div className='text-main ktext-label'>Super-administrateur</div>}
              </div>
              <TextInput 
                  id='pseudo'
                  label='Pseudo'
                  error={userNameError}
                  value={user.userName}
                  onChange={(e) => userQuark.set({
                    ...user,
                    userName: e.target.value as Name
                  })}
              />
            </div>

            {user.role === 'ADMIN' &&
              <div className='absolute right-[5%] top-[5%]'>
                <Button
                  content='Admin'
                  href='/admin'
                  white
                />
              </div>
            }
          </div>
          
          <div className={'w-full ' + (selectedTab === 'PROFILE' ? 'mb-8 md:mb-12' : '')}>
            <Tabs 
              tabs={[{
                icon: Profile,
                iconFill: true,
                iconClassName: 'w-6 h-6',
                color: 'main',
                action: () => setSelectedTab('PROFILE'),
              },
              {
                  icon: Heart,
                  iconStroke: true,
                  iconFill: selectedTab === 'LIKED' ? true : false,
                  iconClassName: 'w-6 h-6',
                  color: 'main',
                  action: () => setSelectedTab('LIKED'),
              },
              {
                  icon: Download,
                  iconStroke: true,
                  iconClassName: 'w-6 h-6',
                  color: 'main',
                  action: () => setSelectedTab('DOWNLOADED'),
              },
              ]}
            />
          </div>

          {selectedTab === 'PROFILE' &&
            <ProfileForm 
              user={props.user}
              onDeleteAccountClick={showModalDelete}
            />
          }

          {selectedTab === 'LIKED' &&
            <LikedList 
              likedTopos={quarkifyLightTopos(likedTopos)}
              onUnlikeTopo={(topo) => unlikeTopo(topo)}
            />
          }

          {selectedTab === 'DOWNLOADED' &&
            <DownloadedList 
              downloadedTopos={[]} //TODO
            />
          }
          
        </div>

      </div>

        <ModalDelete 
            buttonText="Confirmer"
            imgUrl={staticUrl.deleteWarning}
            onConfirm={deleteAccount} 
        >
            Toutes les données du compte seront définitivement supprimées. Êtes-vous sûr.e de vouloir continuer ?
        </ModalDelete>
    </>
  );
});

export default ProfilePage;
