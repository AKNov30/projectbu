import React from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import moment from 'moment';
import fontDev from '../../fonts/Prompt.ttf';
import { logo } from '../../assets';

// Register font
Font.register({ family: 'prompt', src: fontDev });

const Invoice = ({ reservation }) => {
    const styles = StyleSheet.create({
        page: {
            padding: 20,
            backgroundColor: '#FFFFFF',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
        },
        logo: {
            width: 80,
            height: 80,
        },
        companyInfo: {
            alignItems: 'flex-end',
        },
        title: {
            fontFamily: 'prompt',
            fontSize: 24,
            textAlign: 'center',
            marginBottom: 20,
        },
        contactInfo: {
            fontSize: 12,
            marginBottom: 3,
            fontFamily: 'prompt',
        },
        body: {
            paddingHorizontal: 30,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 8,
        },
        leftColumn: {
            width: '50%',
        },
        rightColumn: {
            width: '50%',
            textAlign: 'right',
        },
        address: {
            fontFamily: 'prompt',
            fontSize: 14,
            marginBottom: 5,
        },
        summary: {
            fontFamily: 'prompt',
            fontSize: 16,
            textAlign: 'right',
            marginTop: 20,
        },
        divider: {
            marginVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#000',
        },
        signatureSection: {
            marginTop: 100,
            alignItems: 'flex-end',
        },
        signatureLabel: {
            fontSize: 14,
            fontFamily: 'prompt',
            marginRight:40,
        },
        signatureLine: {
            width: '30%',
            height: 1,
            backgroundColor: '#000',
            marginVertical: 10,
            marginTop: 0,
        },
        signatureText: {
            fontSize: 14,
            fontFamily: 'prompt',
            marginTop: 10,
            marginRight:20,
        },

    });

    // Header with Logo and Contact Info
    const Header = () => (
        <View style={styles.header}>
            <Image
                style={styles.logo}
                src={logo}
                // src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAA..." // Replace with Base64 or URL of the logo
            />
            <View style={styles.companyInfo}>
                <Text style={styles.contactInfo}>230/75 เขตทุ่งครุ แขวงทุ่งครุ จ.กรุงเทพมหานคร</Text>
                <Text style={styles.contactInfo}>โทรศัพท์: 087-994-8760</Text>
                <Text style={styles.contactInfo}>อีเมล: Sittichok.Juns@bumail.net</Text>
            </View>
        </View>
    );

    // Invoice Title
    const InvoiceTitle = () => (
        <Text style={styles.title}>ใบเสร็จการชำระเงินน</Text>
    );

    // Body with Customer and Booking Info
    const Body = () => (
        <View style={styles.body}>
            <View style={styles.row}>
                <View style={styles.leftColumn}>
                    <Text style={styles.address}>ชื่อผู้จอง: {reservation.firstname} {reservation.lastname}</Text>
                    <Text style={styles.address}>วันที่จอง: {moment(reservation.created_at).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.address}>วันที่รับสุนัข: {moment(reservation.booking_date).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.address}>เวลาที่รับสุนัข: {reservation.pickup_date.slice(0, 5)}</Text>
                </View>
                <View style={styles.rightColumn}>
                    <Text style={styles.address}>รหัสการจอง: {reservation.booking_id}</Text>
                    <Text style={styles.address}>ชื่อสนุัข: {reservation.dogs_name}</Text>
                    <Text style={styles.address}>ราคาสุนัข: {formatPrice(reservation.price)} บาท</Text>
                    <Text style={styles.address}>ราคาการจอง: {formatPrice(reservation.price/2)} บาท</Text>
                    <Text style={styles.address}>ราคาที่ชำระเพิ่ม: {formatPrice(reservation.price/2)} บาท</Text>
                </View>
            </View>
        </View>
    );

    // Summary at the Bottom
    const Summary = () => (
        <Text style={styles.summary}>รวมทั้งสิ้น: {formatPrice(reservation.price)} บาท</Text>
    );

    // Signature Section at the Bottom
    const SignatureSection = () => (
        <View style={styles.signatureSection}>
            <Text style={styles.signatureLabel}>ลงชื่อผู้รับเงิน</Text>
            <Text style={styles.signatureText}>สิทธิโชค จัทร์ทรง</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureText}>(สิทธิโชค จัทร์ทรง)</Text>
        </View>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page} orientation="portrait">
                <Header />
                <InvoiceTitle />
                <View style={styles.divider} />
                <Body />
                <View style={styles.divider} />
                <Summary />
                <SignatureSection />
            </Page>
        </Document>
    );
};

export default Invoice;
