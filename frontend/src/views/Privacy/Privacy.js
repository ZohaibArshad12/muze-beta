import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Section, SectionAlternate } from 'components/organisms';
import { Breadcrumb } from './components';
import { SectionHeader } from '../../components/molecules';
import { useApp } from '../../AppProvider';

export const breadcrumb = [
  {
    href: '/',
    title: 'Home',
    isActive: false,
  },
  {
    href: '/privacy',
    title: 'Privacy Policy',
    isActive: true,
  },
];

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    width: '100%',
    '& span': {
      color: theme.palette.text.light
    },
    '& strong': {
      color: 'white',
    },
  },
  sectionBreadcrumb: {
    '& .section-alternate__content': {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  pagePaddingTop: {
    paddingTop: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(5),
    },
  },
}));

const Privacy = () => {
  const classes = useStyles();
  const app = useApp();

  return (
    <div className={classes.root}>
      <SectionAlternate className={classes.sectionBreadcrumb}>
        <Breadcrumb data={breadcrumb} />
      </SectionAlternate>
      <Section className={classes.pagePaddingTop}>
        <SectionHeader
          title="Privacy Policy"
          align="left"
        />
        <div>
          <p><span>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from {app.settings.domain} (the “Site”).</span><br /><br /><strong>Personal
            information we collect</strong><span></span><br /><span>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information”.</span><br /><br /><span>We collect Device Information using the following technologies:</span><br /><span>- “Cookies” are data files that are placed on your device or computer and often include an anonymous unique identifier. For more information about cookies, and how to disable cookies, visit http://www.allaboutcookies.org.</span><br /><span>- “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.</span><br /><span>- “Web beacons”, “tags”, and “pixels” are electronic files used to record information about how you browse the Site.</span><br /><br /><span>Additionally, when you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, payment information (including credit card numbers), email address, and phone number. We refer to this information as “Order Information”&nbsp;</span><br /><br /><span>When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.</span><br /><br /><strong>How
            do we use your personal information?</strong><span></span><br /><span>We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). Additionally, we use this Order Information to:</span><br /><span>- Communicate with you;</span><br /><span>- Screen our orders for potential risk or fraud; and</span><br /><span>- When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</span><br /><br /><span>We use the Device Information that we collect to help us screen for potential risk and fraud (in particular, your IP address), and more generally to improve and optimize our Site (for example, by generating analytics about how our customers browse and interact with the Site, and to assess the success of our marketing and advertising campaigns).</span><br /><br /><strong>Sharing
            your Personal Information</strong><span></span><br /><span>We share your Personal Information with third parties to help us use your Personal Information, as described above. For example, we use Shopify to power our online store--you can read more about how Shopify uses your Personal Information here: https://www.shopify.com/legal/privacy. We also use Google Analytics to help us understand how our customers use the Site -- you can read more about how Google uses your Personal Information here: https://www.google.com/intl/en/policies/privacy/. You can also opt-out of Google Analytics here: https://tools.google.com/dlpage/gaoptout.</span><br /><br /><span>Finally, we may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful requests for information we receive, or to otherwise protect our rights.</span><br /><br /><strong>Behavioral
            advertising</strong><span></span><br /><span>As described above, we use your Personal Information to provide you with targeted advertisements or marketing communications we believe may be of interest to you. For more information about how targeted advertising works, you can visit the Network Advertising Initiative’s (“NAI”) educational page at http://www.networkadvertising.org/understanding-online-advertising/how-does-it-work.</span><br /><br /><span>You can opt out of targeted advertising by using the links below:</span><br /><span>- Facebook: https://www.facebook.com/settings/?tab=ads</span><br /><span>- Google: https://www.google.com/settings/ads/anonymous</span><br /><span>- Bing: https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads&nbsp;</span><br /><br /><span>Additionally, you can opt-out of some of these services by visiting the Digital Advertising Alliance’s opt-out portal at http://optout.aboutads.info/.</span><br /><br /><strong>Do
            not track</strong><span></span><br /><span>Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.</span><br /><br /><strong>Your
            rights</strong><span></span><br /><span>If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.</span><br /><br /><span>Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above. Additionally, please note that your information will be transferred outside of Europe, including Canada and the United States.</span><br /><br /><strong>Data
            retention</strong><span></span><br /><span>When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.</span><br /><br /><strong>Changes</strong><span></span><br /><span>We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.</span><br /><br /><strong>Contact
            us</strong><span></span><br /><span>For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e‑mail at {app.settings.email} or by mail using the details provided below:</span><br /><br />
            {app.settings.company_name}.<br /><span>Re: Privacy Compliance Officer</span><br /><span>{app.settings.address}<br /></span><span>{app.settings.city}, {app.settings.state} {app.settings.zip}<br />United States</span>
          </p>
        </div>
      </Section>
    </div>
  );
};

export default Privacy;
