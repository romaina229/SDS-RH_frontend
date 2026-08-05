import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import Card from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from '../../api/axios';

const QRClock: React.FC = () => {
    const { user } = useAuth();
    const [qrCode, setQrCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [scanned, setScanned] = useState<boolean>(false);
    const [expiresAt, setExpiresAt] = useState<string>('');

    useEffect(() => {
        generateQR();
    }, [user?.employee?.id]);

    const generateQR = async (): Promise<void> => {
        if (!user?.employee?.id) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get('/attendances/generate-qr', {
                params: { employee_id: user?.employee?.id }
            });
            setQrCode(response.data.qr_code);
            setExpiresAt(response.data.expires_at);
        } catch (error) {
            toast.error('Erreur lors de la génération du QR code');
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async (): Promise<void> => {
        setScanned(true);
        try {
            await axios.post(`/attendances/scan/${qrCode}`);
            toast.success('Pointage QR code enregistré');
            setTimeout(() => setScanned(false), 3000);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors du pointage');
            setScanned(false);
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pointage QR Code</h1>
                    <p className="text-gray-500 mt-1">Scannez votre QR code pour pointer</p>
                </div>

                <div className="flex justify-center">
                    <Card className="max-w-md w-full">
                        <div className="text-center space-y-6">
                            <div className="bg-gray-100 rounded-lg p-8">
                                {loading ? (
                                    <div className="flex justify-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
                                    </div>
                                ) : qrCode ? (
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-lg inline-block">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrCode}`}
                                                alt="QR Code"
                                                className="mx-auto"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Scannez ce QR code avec votre téléphone
                                        </p>
                                        {expiresAt && (
                                            <p className="text-xs text-gray-400">
                                                Expire à {new Date(expiresAt).toLocaleTimeString('fr-FR')}
                                            </p>
                                        )}
                                        <button
                                            onClick={handleScan}
                                            disabled={scanned}
                                            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                                        >
                                            {scanned ? 'Pointage en cours...' : 'Simuler le scan'}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Aucun QR code généré</p>
                                )}
                            </div>

                            <button
                                onClick={generateQR}
                                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                                Régénérer le QR code
                            </button>
                        </div>
                    </Card>
                </div>

                <Card>
                    <div className="text-sm text-gray-600 space-y-2">
                        <h3 className="font-medium text-gray-900">Instructions :</h3>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Ouvrez l'application mobile SDS-RH</li>
                            <li>Scannez le QR code affiché</li>
                            <li>Confirmez votre pointage</li>
                            <li>Vous recevrez une confirmation</li>
                        </ol>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default QRClock;