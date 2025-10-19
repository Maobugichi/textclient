import BlockCont from "./block-cont";
import Blocks from "../../ui/blocks";
import ForwardBlocks from "./forwardBlocks";
import { Link, Navigate } from "react-router-dom";
import {
    Users,
    CreditCard,
    ArrowUpRight,
    Plus,
    HelpCircle,
} from 'lucide-react';
import SlideShow from "../../ui/slideshow";
import { useState, useEffect } from "react";
import TransactionsList from "../payment/transactionTable";
import { toast } from "sonner";
import api from "../../lib/axios-config";
import { DashboardTour } from "./dashtour";
import { Button } from "../../components/ui/button";

interface DashProps {
    info: any;
    theme: boolean;
    userData: any;
    balance: any;
}

const DashInfo: React.FC<DashProps> = ({ info, theme,  userData, balance }) => {
    const [width, setWidth] = useState<any>(window.innerWidth);
    const [links, setLinks] = useState<string>('');
    const [referralCode, setReferralCode] = useState("");
   
    const [showTour, setShowTour] = useState(false);

   
    useEffect(() => {
        const tourCompleted = localStorage.getItem('dashboardTourCompleted');
        const isNewUser = !localStorage.getItem('userFirstVisit');
        if (!tourCompleted && isNewUser) {
            setTimeout(() => {
                setShowTour(true);
                localStorage.setItem('userFirstVisit', 'true');
            }, 1000);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, []);

    useEffect(() => {
        const handleWidth = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleWidth);
        return () => window.removeEventListener('resize', handleWidth);
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await api.get("/api/links");
            setLinks(res.data[1].link);
        } catch (err) {
            console.log(err);
            alert("Failed to fetch links");
        }
    };

    let lengthArr = 0;
    const dashed = localStorage.getItem("arr-length");

    if (dashed) {
        try {
            const data = JSON.parse(dashed);
            lengthArr = data.balance;
        } catch (err) {
            console.error("Invalid JSON in storage:", err);
        }
    }

    const blockInfo = [
        {
            extra: 'Balance',
            amount: balance,
            content: 'Fund Wallet',
            btnIcon: <Plus size={17} />,
            link: '/payment/1',
            tourId: 'balance'
        },
        {
            extra: 'Purchase Number',
            amount: info.length ? info.length : lengthArr,
            icon: <Users size={17} />,
            content: 'Receive SMS',
            btnIcon: <ArrowUpRight size={17} />,
            link: '/sms/1',
            tourId: 'purchase'
        },
        {
            extra: 'Rented Numbers',
            amount: '0',
            icon: <CreditCard size={17} />,
            content: 'Rent Number',
            btnIcon: <ArrowUpRight size={17} />,
            link: '/number/1',
            tourId: 'rent'
        }
    ];

    useEffect(() => {
        const fetchReferral = async () => {
            try {
                const response = await api.get(`/api/ref`);
                setReferralCode(response.data);
                return response.data;
            } catch (err: any) {
                console.error(err?.status);
                return <Navigate to={`/login`} replace />;
            }
        };

        fetchReferral();
    }, []);

    const generateReferralCode = async (e: any) => {
        const target = e.target as HTMLElement;
        if (target.innerText == 'Textflex' || target.innerText == 'Join our telegram channel for more info and updates') {
            return;
        }
        try {
            await navigator.clipboard.writeText(referralCode);
            toast.success('Link copied to your clipboard!');
        } catch (err) {
            console.error("Clipboard copy failed", err);
            toast.error("Failed to copy code");
        }
    };

    const forwardInfo = [
        {
            link: '',
            onClick: generateReferralCode,
            text: 'Referral Link',
            forward: 'Click to copy your referral link',
            tourId: 'referral'
        },
        {
            link: links,
            onClick: null,
            text: 'Textflex',
            forward: 'Join our telegram channel for more info and updates'
        }
    ];

   
  

    const blocks = blockInfo.slice(0, blockInfo.length - 2).map((info, index) => (
        <Link 
            key={index}
            className="w-[90%] md:w-[45%]" 
            to={info.link}
            data-tour={info.tourId}
        >
            <Blocks
                extra={info.extra}
                icon={info.icon}
                amount={`₦${balance}`}
                content={info.content}
                btnIcon={info.btnIcon}
                className="h-[180px] md:h-[150px] lg:h-[210px] rounded-4xl bg-[#0032a5] w-full grid object-cover overflow-hidden place-items-center border border-solid border-[#5252] text-white relative"
                isMerge={false}
            />
        </Link>
    ));

    const lastTwoBlocks = blockInfo.slice(-2).map((info, index) => (
        <Link 
            key={index}
            className="w-full" 
            to={info.link}
            data-tour={info.tourId}
        >
            <Blocks
                extra={info.extra}
                icon={info.icon}
                amount={info.amount ? info.amount : 0}
                content={info.content}
                btnIcon={info.btnIcon}
                className="h-fit md:h-[80px] lg:h-[100px] py-3 min-h-[100px] overflow-hidden rounded-4xl bg-[#0032a5] w-full grid place-items-center border border-solid border-[#5252] text-white relative"
                isMerge={true}
            />
        </Link>
    ));

    const forward = forwardInfo.map((item, index) => (
        <div className="w-1/2 " key={index} data-tour={item.tourId}>
            <ForwardBlocks
                text={item.text}
                forward={item.forward}
                theme={theme}
                link={item.link}
                onClick={generateReferralCode}
            />
        </div>
    ));

   
    const tourSteps = [
        {
            target: '[data-tour="balance"]',
            title: 'Your Wallet Balance',
            description: 'This shows your current wallet balance. Click "Fund Wallet" to deposit funds using cryptocurrency or fiat payments.',
            position: 'right' as const,
            mobilePosition:'bottom' as const
        },
        {
            target: '[data-tour="purchase"]',
            title: 'Purchase Numbers',
            description: 'View the total number of SMS numbers you have purchased. Click here to buy new numbers and receive SMS.',
            position: 'bottom' as const,
        },
        {
            target: '[data-tour="rent"]',
            title: 'Rent Numbers',
            description: 'Rent phone numbers for longer periods. Perfect for extended use cases and business needs.',
            position: 'left' as const,
        },
        {
            target: '[data-tour="referral"]',
            title: 'Referral Program',
            description: 'Share your referral link with friends and earn rewards when they sign up and make purchases!',
            position: 'bottom' as const,
        },
        {
            target: '[data-tour="transactions"]',
            title: 'Transaction History',
            description: 'View all your past transactions here. You can see deposits, purchases, and refunds. Use the filter button to sort by status.',
            position: 'top' as const,
        },
    ];

    return (
        <div className={`h-fit font-montserrat lg:ml-10 w-[95%] mx-auto lg:w-[85%] flex flex-col gap-12 ${theme ? 'text-white' : 'text-black'}`}>
            <div className="h-fit grid gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Welcome {userData?.username}{' '}
                        <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
                    </h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTour(true)}
                        className="gap-2"
                    >
                        <HelpCircle size={16} />
                        <span className="hidden sm:inline">Take Tour</span>
                    </Button>
                </div>
                
                <BlockCont theme={theme}>
                    {blocks}

                    <div className="flex flex-col h-fit min-h-[23vh] md:min-h-[15vh] justify-between gap-2 w-[90%] md:w-[48%] lg::w-[45%]">
                        {lastTwoBlocks}
                    </div>
                    {width <= 600 && <SlideShow />}
                </BlockCont>
                {width > 600 && <SlideShow />}
            </div>

            <div className="h-auto flex flex-col gap-4 w-full">
                <div className="flex flex-col md:flex-row justify-between gap-4 ">
                    {forward}
                </div>

                <div data-tour="transactions">
                    <TransactionsList userId={userData?.userId}/>
                </div>
            </div>

           
            <DashboardTour
                steps={tourSteps}
                isOpen={showTour}
                onComplete={() => {
                    setShowTour(false);
                    localStorage.setItem('dashboardTourCompleted', 'true');
                    toast.success('Tour completed! You can restart it anytime from the help button.');
                }}
                onSkip={() => {
                    setShowTour(false);
                    toast.info('You can restart the tour anytime from the help button.');
                }}
            />
        </div>
    );
}

export default DashInfo;