import Layout from '../../components/common/Layout';
import OrganizationTree from '../../components/organization/OrganizationTree';

const Organigram: React.FC = () => {
    return (
        <Layout>
            <div className='space-y-6'>
                <OrganizationTree/>
            </div>
        </Layout>
    );
};

export default Organigram;
