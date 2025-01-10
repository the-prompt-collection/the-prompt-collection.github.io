import React, { useEffect, useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaStar, FaCodeBranch } from 'react-icons/fa';
import { fetchRepoData } from '../utils/github';

const Footer = () => {
  const [repoData, setRepoData] = useState(null);

  useEffect(() => {
    const getRepoData = async () => {
      try {
        const data = await fetchRepoData();
        setRepoData(data);
      } catch (error) {
        console.error('Error fetching GitHub repository data:', error);
      }
    };

    getRepoData();
  }, []);

  return (
    <footer className="py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* GitHub Project Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">GitHub Project</h3>
            {repoData && (
              <div className="space-y-2">
                <a
                  href={repoData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-blue-500"
                >
                  <FaGithub className="mr-2" />
                  {repoData.full_name}
                </a>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <FaStar className="mr-1" />
                    {repoData.stargazers_count}
                  </span>
                  <span className="flex items-center">
                    <FaCodeBranch className="mr-1" />
                    {repoData.forks_count}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social Links</h3>
            <div className="space-y-2">
              <a
                href="https://github.com/the-prompt-collection"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center  hover:text-blue-500"
              >
                <FaGithub className="mr-2" />
                GitHub
              </a>
              <a
                href="https://twitter.com/the-prompt-collection"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center  hover:text-blue-500"
              >
                <FaTwitter className="mr-2" />
                Twitter
              </a>
            </div>
          </div>

          {/* License */}
          <div>
            <h3 className="text-lg font-semibold mb-4">License</h3>
            <p className="">
              This project is licensed under the{' '}
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                MIT License
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;