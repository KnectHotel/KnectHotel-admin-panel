import ChatWithStaffDetail from '@/components/service-management/chatwithstaff/RequestDetails';

const ViewChatDetails = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  // console.log('chat id', id)

  return (
    <div className="flex justify-center items-center h-screen w-full pt-28">
      <div className="h-full w-full container">
        <ChatWithStaffDetail chatId={id} />
      </div>
    </div>
  );
};

export default ViewChatDetails;
